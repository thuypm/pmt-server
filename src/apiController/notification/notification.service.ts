import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken, UserDto } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose';
import { Notice } from 'src/dto/notice.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(private userRepo: UserRepository) {}

  async pushNotification(username: string, notification: Notice) {
    if (!notification?.id) notification.id = uuid();
    return await this.userRepo.update(
      { username: username },
      {
        $push: {
          notices: { $each: [notification], $position: 0 },
        },
      },
    );
  }
  async getAllNotification(user: UserDecodeToken, page: number) {
    return await this.userRepo.getNotificationPaging(
      { username: user.username },
      page,
    );
  }
  async handleReadNotice(user: UserDecodeToken, listNoticeId: Array<string>) {
    listNoticeId.forEach(async (noticeId) => {
      await this.userRepo.update(
        { _id: Types.ObjectId(user._id.toString()), 'notices.id': noticeId },
        {
          $set: {
            'notices.$.status': true,
          },
        },
      );
    });
    return true;
  }
  async handleReadAllNotice(user: UserDecodeToken) {
    return await this.userRepo.updateMany(
      {
        _id: Types.ObjectId(user._id.toString()),
        'notices.id': { $regex: /-/ },
      },
      {
        $set: {
          'notices.$[].status': true,
        },
      },
    );
  }
}
