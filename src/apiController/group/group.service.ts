import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken, UserDto, } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose'
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { CreateGroupDto } from 'src/dto/group.dto';
import { Notice } from 'src/dto/notice.dto';
import { NotificationGateway } from 'src/socket/Notification';

@Injectable()
export class GroupService {
  constructor(private groupRepo: GroupReponsitory, private userRepo: UserRepository, private noti: NotificationGateway) {
  };


  async createGroup(group: CreateGroupDto) {
    group._id = Types.ObjectId();
    await this.groupRepo.create(group);
    let noti: Notice = new Notice();
    noti = {
      title: "Nhóm mới",
      status: false,
      aciton: "/all-group",
      content: group.owner.username + " đã tạo nhóm " + group.name
    }
    await this.userRepo.update({ _id: Types.ObjectId(group?.owner?._id.toString()), username: group?.owner?.username }, {
      $push: {
        group_ids: group._id,
      },
    })
    group.members.forEach(async e => {
      await this.userRepo.update({ _id: Types.ObjectId(e._id.toString()), username: e.username }, {
        $push: {
          group_ids: group._id,
          notices: noti
        },
      })
      this.noti.pushNotiToClient(e.username, noti);
    })
    return {}
  }
  async getOneGroup(id: string) {
    return await this.groupRepo.findOne({ _id: Types.ObjectId(id) });
  }
  async getAllGroup(user: UserDecodeToken) {
    let userFind: UserDto = await this.userRepo.findOne({ _id: Types.ObjectId(user._id.toString()) });
    if (userFind) {
      let convert_ids: Array<Types.ObjectId> = userFind?.group_ids.map(e => {
        return Types.ObjectId(e.toString());
      })
      return await this.groupRepo.getListGroupOfUser(convert_ids);
    }
    else
      return []
  }
}
