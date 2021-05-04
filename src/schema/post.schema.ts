import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommentDto } from 'src/dto/comment.dto';
import { Message } from 'src/dto/message.dto';
import { UserDecodeToken } from 'src/dto/user.dto';
import { BaseModel } from './base.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post extends BaseModel {
  @Prop()
  owner: UserDecodeToken;
  @Prop()
  group_id: Types.ObjectId;
  @Prop()
  content: string;
  @Prop()
  filePath: string;
  @Prop()
  file_type: string;
  @Prop()
  file_name: string;
  @Prop()
  list_comment: Array<CommentDto>;
  @Prop()
  time: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
