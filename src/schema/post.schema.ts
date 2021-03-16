import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommentDto } from 'src/dto/comment.dto';
import { Message } from 'src/dto/message.dto';
import { UserDecodeToken } from 'src/dto/user.dto';
import { BaseModel } from './base.schema';


export type PostDocument = Post & Document;

@Schema()
export class Post extends BaseModel {
    @Prop()
    username: string
    @Prop()
    content: string
    @Prop()
    listFile:Array<UserDecodeToken>
    @Prop()
    listComments: Array<CommentDto>
    @Prop()
    listMessage: Array<Message>
}

export const GroupSchema = SchemaFactory.createForClass(Post);