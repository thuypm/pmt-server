import { Model, Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupDocument, Group } from 'src/schema/group.schema';
import { Message } from 'src/dto/message.dto';

@Injectable()
export default class GroupReponsitory extends BaseRepository<GroupDocument> {
  constructor(@InjectModel(Group.name) model: Model<GroupDocument>) {
    super(model);
  }
  async getListGroupOfUser(list_ids: Array<Types.ObjectId>) {
    return await this.model
      .find({
        _id: {
          $in: list_ids,
        },
      })
      .select({ name: 1, _id: 1, description: 1, owner: 1, members: 1 })
      .limit(20);
  }
  async pushNewMessage(roomId: string, message: Message) {
    return await this.model.updateOne(
      { _id: Types.ObjectId(roomId.toString()) },
      {
        $push: {
          listMessage: message,
        },
      },
    );
  }
  async getAllMessage(id: Types.ObjectId) {
    return await this.model
      .findOne({
        _id: id,
      })
      .select({ listMessage: 1, owner: 1, members: 1 });
  }
  async getALlPost(id: Types.ObjectId) {
    return await this.model
      .findOne({
        _id: id,
      })
      .select({ listPost: 1 });
  }
}
