import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose'
import { Notice } from 'src/dto/notice.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {
  };

  async getUserYourSelf(username: string) {
    let result = await this.userRepo.findUserWithoutPassword({ username: username });
    return result;
  }
  async createUser(user: CreateUserDto) {
    user._id = Types.ObjectId();
    return await this.userRepo.create(user);
  }
  async pushNotification(username: string, notification: Notice) {
    return await this.userRepo.update({ username: username }, {
      $push: {
        notices: notification
      },
    })
  }
  async findUser(query: any) {
    return await this.userRepo.findAllLikely(query);
  }
}
