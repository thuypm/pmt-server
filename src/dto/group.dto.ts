import { Types } from 'mongoose'
import {Message} from './message.dto'
import {Posts} from './post.dto'

export class Group {
    _id:  string | Types.ObjectId
    password: string
    name: string
    members: Array<string>;
    listPost: Array<Posts>;
    listMessage: Array<Message>;

}
export class CreateGroupDto {
    _id: string | Types.ObjectId
    password: string
    name: string
    members: Array<string>;
    listPost: [];
    listMessage: [];
}