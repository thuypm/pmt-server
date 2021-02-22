import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import {Types} from 'mongoose'

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) { 
  };

  async getUserYourSelf(username: string) {
    let result = await this.userRepo.findUserWithoutPassword({username: username});
    return result;
  }
  async createUser(user: CreateUserDto) {
    user._id = Types.ObjectId();
    return await this.userRepo.create(user);
  }
}
