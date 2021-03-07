
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
    async findUserWithoutPassword(user: any){
        return await this.model.findOne(user, { 'password': false, '__v': false })
    }
   async findAllLikely(query: any){
    	return await this.model.find({username: new RegExp(query?.username, "i") }).select({username: 1, _id:1}).limit(10);
    }
  }
  