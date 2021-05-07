import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose';
import * as fs from 'fs';
import { Notice } from 'src/dto/notice.dto';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) { }
  async saveAvatar(file: Express.Multer.File, user: UserDecodeToken) {
    if (file?.mimetype !== 'image/jpeg')
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            label: 'Lỗi',
            content: 'File không hợp lệ',
          },
        ],
      },
        HttpStatus.BAD_REQUEST)
    else {
      const pathFile =
        './public/user/' +
        user.username +
        path.extname(file.originalname);
      await fs.renameSync(file?.path, pathFile);
      return {}
    }
  }
  async getUserYourSelf(username: string) {
    const result = await this.userRepo.findUserWithoutPassword({
      username: username,
    });
    return result;
  }
  async createUser(user: CreateUserDto) {
    user._id = Types.ObjectId();
    return await this.userRepo.create(user);
  }

  async findUser(query: any) {
    return await this.userRepo.findAllLikely(query);
  }
}
