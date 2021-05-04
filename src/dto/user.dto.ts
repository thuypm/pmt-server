import { Notice } from './notice.dto';
import { Types } from 'mongoose';

export class UserDto {
  _id: string | Types.ObjectId;
  username: string;
  password: string;
  group_ids: Array<string | Types.ObjectId>;
  notices: Array<Notice>;
}
export class UserResponse {
  _id: string | Types.ObjectId;
  username: string;
  group_ids: Array<string | Types.ObjectId>;
  notices: Array<Notice>;
}
export class CreateUserDto {
  _id: string | Types.ObjectId;
  username: string;
  password: string;
}
export class UserDecodeToken {
  _id: string | Types.ObjectId;
  username: string;
}
