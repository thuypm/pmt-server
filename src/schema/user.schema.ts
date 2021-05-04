import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Notice } from 'src/dto/notice.dto';
import { BaseModel } from './base.schema';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseModel {
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  group_ids: Array<string>;
  @Prop()
  notices: Array<Notice>;
}

export const UserSchema = SchemaFactory.createForClass(User);
