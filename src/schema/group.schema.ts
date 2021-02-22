import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from 'src/dto/message.dto';
import { Posts } from 'src/dto/post.dto';
import { BaseModel } from './base.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group extends BaseModel {
    @Prop()
    members: string
    @Prop()
    owner: string
    @Prop()
    listPost: Array<Posts>
    @Prop()
    listMessage: Array<Message>
}

export const UserSchema = SchemaFactory.createForClass(Group);