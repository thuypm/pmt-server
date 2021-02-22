
import {UserDocument, User, UserSchema } from "../schema/user.schema"
import { Model, Document } from 'mongoose';
import BaseRepository from "./BaseRepository";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export default class UserRepository extends BaseRepository<UserDocument>{
    constructor(@InjectModel(User.name)   model: Model<UserDocument>) {
        super(model);
    }
    findUserWithoutPassword(user: any){
        return this.model.findOne(user, { 'password': false, '__v': false })
    }
  }
  