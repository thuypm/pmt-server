import { UserDocument, User, UserSchema } from '../schema/user.schema';
import { Model, Document } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
const PAGE_SIZE = 7;

@Injectable()
export default class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
  async findUserWithoutPassword(user: any) {
    return await this.model.findOne(user, { password: false, __v: false });
  }
  async findAllLikely(query: any) {
    return await this.model
      .find({ username: new RegExp(query?.username, 'i') })
      .select({ username: 1, _id: 1 })
      .limit(10);
  }
  async getNotificationPaging(query: any, page: number) {
    const data = await this.model.findOne(query).select({ notices: 1, _id: 1 });
    const len: number = data?.notices?.length;
    // let totalPage: number = Math.ceil(len / PAGE_SIZE);
    const responseData =
      page * PAGE_SIZE > len
        ? data?.notices?.slice((page - 1) * PAGE_SIZE, len)
        : data?.notices?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return {
      listData: responseData,
      pagination: {
        total: len,
        current: page,
        pageSize: PAGE_SIZE,
      },
    };
  }
}
