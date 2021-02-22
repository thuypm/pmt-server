import { Notice } from "./notice.dto";
import {Types} from 'mongoose'

export class UserDto {
    _id: string|Types.ObjectId;
    username: string;
    password: string;
    group_ids: Array<string>
    notices: Array<Notice>
}
export class UserResponse {
    _id: string|Types.ObjectId;
    username: string;
    group_ids: Array<string>
    notices: Array<Notice>

}
export class CreateUserDto {
    _id: Types.ObjectId|String;
    username: string;
    password: string;
}
export class UserDecodeToken {
    _id: Types.ObjectId| string;
    username: string;
}