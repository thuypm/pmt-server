import { IsArray } from 'class-validator'
import { Types } from 'mongoose'
import {Message} from './message.dto'
import {Posts} from './post.dto'
import {UserDecodeToken} from './user.dto'


export class GroupDto {
    _id:  string | Types.ObjectId;
    description: string
    name: string
    members: Array<UserDecodeToken>;
    listPost: Array<Posts>;
    owner: UserDecodeToken;
    listMessage: Array<Message>;

}
export class CreateGroupDto {
    _id: string | Types.ObjectId;
    description: string;
    owner: UserDecodeToken
    name: string;

    @IsArray()
    members: Array<UserDecodeToken>;
    listPost: [];
    listMessage: [];
}