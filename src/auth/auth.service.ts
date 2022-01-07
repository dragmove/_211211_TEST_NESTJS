import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { ServiceResult } from 'src/interfaces/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
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
      const payload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      console.log('accessToken :', accessToken);

      return {
        message: 'ok',
        data: {
          accessToken,
        },
      };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
