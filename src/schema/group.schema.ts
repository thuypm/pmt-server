import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from 'src/dto/message.dto';
import { UserDecodeToken } from 'src/dto/user.dto';
import { BaseModel } from './base.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group extends BaseModel {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  members: Array<UserDecodeToken>;
  @Prop()
  owner: UserDecodeToken;
  @Prop()
  listMessage: Array<Message>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
