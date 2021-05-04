import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose';

@Injectable()
export class GateService {
  constructor(private userRepo: UserRepository) {}
  async getUserByUsername(username: string) {
    const result = await this.userRepo.findOne({
      username: username,
    });
    return result;
  }
  async createUser(user: CreateUserDto) {
    user._id = Types.ObjectId();
    return await this.userRepo.create(user);
  }
}
