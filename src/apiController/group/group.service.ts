import { Injectable } from '@nestjs/common';
import { CreateUserDto, } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import {Types} from 'mongoose'
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { CreateGroupDto } from 'src/dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private userRepo: GroupReponsitory) { 
  };


  async createGroup(group: CreateGroupDto) {
    group._id = Types.ObjectId();
    return await this.userRepo.create(group);
  }
}
