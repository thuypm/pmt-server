import { Injectable } from '@nestjs/common';
import { UserDecodeToken, UserDto } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}
  async verifyToken(token: string) {
    return await this.jwt.verify(token);
  }
  async decodedToken(token: string) {
    let user_decode;
    if (token) {
      user_decode = await this.jwt.decode(token);
      return user_decode;
    }
    return null;
  }
  async generateJWT(user: UserDto) {
    return this.jwt.sign({
      username: user.username,
      _id: user._id,
    });
  }
}
