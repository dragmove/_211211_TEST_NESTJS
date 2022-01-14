import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ServiceResult } from 'src/interfaces/common';
import { jwtConstants } from './constants';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

// FIXME: jwt accessToken, refreshToken 만들어 인증하는 흐름은 별도 구현 필요
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { username: string }): Promise<Partial<User>> {
    const { username } = payload;

    const user: User = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
