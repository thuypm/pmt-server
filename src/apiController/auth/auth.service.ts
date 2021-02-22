import { Injectable } from '@nestjs/common';
import {  UserDecodeToken, UserDto } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class   AuthService{
  constructor(private userRepo: UserRepository, private readonly jwt: JwtService) { 
  };
  async verifyToken (token: string)
  {
    return await this.jwt.verify(token);
  }
  async decodedToken (token: string)
  {
    let userDecoded = new UserDecodeToken();
    let user_decode = await this.jwt.decode(token);
    Object.keys(user_decode).map(e=>{
      userDecoded[e] = user_decode[e];
    })
    return userDecoded;
  }
  async generateJWT(user: UserDto){
    return this.jwt.sign({
      username: user.username,
      _id: user._id
    });
  }
}
