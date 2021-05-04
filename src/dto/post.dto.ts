import { Types } from 'mongoose';
import { CommentDto } from './comment.dto';
import { UserDecodeToken } from './user.dto';

export class PostDto {
  _id: Types.ObjectId | string;
  owner: UserDecodeToken;
  group_id: Types.ObjectId | string;
  content: string;
  file_name: string;
  filePath: string;
  file_type: string;
  list_comment: Array<CommentDto>;
  time: number;
}
