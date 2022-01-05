import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { ServiceResult } from 'src/interfaces/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<ServiceResult> {
    await this.userRepository.createUser(authCredentialDto);

    return {
      message: 'ok',
    };
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<ServiceResult> {
    const { username, password } = authCredentialDto;

    const user = await this.userRepository.findOne({
      username,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        message: 'ok',
      };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
