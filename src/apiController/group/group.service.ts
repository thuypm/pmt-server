import { Injectable } from '@nestjs/common';
import { CreateUserDto, } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose'
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { CreateGroupDto } from 'src/dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private groupRepo: GroupReponsitory, private userRepo: UserRepository) {
  };


  async createGroup(group: CreateGroupDto) {
    group._id = Types.ObjectId();
    await this.groupRepo.create(group);
    
    group.members.forEach(async e => {
      await this.userRepo.update({ _id: e._id, username: e.username }, {
        $push: {
          group_ids: group._id
        }
      })
    })

    return {}
  }
}
