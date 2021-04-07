import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken, UserDto, } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose'
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { CreateGroupDto, GroupDto } from 'src/dto/group.dto';
import { Notice } from 'src/dto/notice.dto';
import { NotificationGateway } from 'src/socket/Notification';
import * as fs from 'fs'

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
    await fs.mkdir('./public/group/' + group._id, function (err) {
      if (err) {
        return console.error(err);
      }
    })
    await this.userRepo.update({ _id: Types.ObjectId(group?.owner?._id.toString()), username: group?.owner?.username }, {
      $push: {
        group_ids: group._id,
      },
    })
    group.members.forEach(async e => {
      await this.userRepo.update({ _id: Types.ObjectId(e._id.toString()), username: e.username }, {
        $push: {
          group_ids: group._id,
        },
      })
      this.noti.pushNotiToClient([e.username], noti);
    })
    return {}
  }
  async getOneGroup(id: string) {
    return await this.groupRepo.findOne({ _id: Types.ObjectId(id) });
  }
  async joinGroup(object: any) {

    let userFind: UserDecodeToken = await this.userRepo.findOne({ username: object.username });
    let group: GroupDto = await this.groupRepo.findOne({ _id: object.groupCode });

    if (userFind && group) {
      if (!group.members.find(e => e.username === userFind.username) && group.owner.username !== userFind.username) {
        await this.groupRepo.update({ _id: object.groupCode }, {
          $push: {
            members: userFind
          }
        });
        await this.userRepo.update({ username: object.username }, {
          $push: {
            group_ids: group._id
          }
        })
        return true;
      }
      else {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn đã ở trong nhóm này'
            }
          ],
        }, HttpStatus.BAD_REQUEST)
      }
    }
    else
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            label: 'Lỗi',
            content: 'Username hoặc mã nhóm không tồn tại'
          }
        ],
      }, HttpStatus.BAD_REQUEST)
  }
  async updateGroup(id: Types.ObjectId, group: GroupDto) {
    let groupFind: GroupDto = await this.groupRepo.findOne({ _id: id });
    group?.members?.forEach(async member => {
      if (!groupFind?.members.find(e => e.username === member.username)) {
        let noti: Notice = {
          title: "Nhóm mới",
          status: false,
          aciton: "/all-group",
          content: "Bạn đã được thêm vào nhóm " + group.name
        }
        await this.userRepo.update({ username: member.username }, {
          $push: {
            group_ids: group._id,
          }
        })
        this.noti.pushNotiToClient([member.username], noti)
      }
    })
    return await this.groupRepo.update({ _id: id }, {
      name: group.name,
      description: group.description,
      members: group.members,
      owner: group.owner
    })
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
