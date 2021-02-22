
import { Model, } from 'mongoose';
import BaseRepository from "./BaseRepository";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupDocument,Group } from "src/schema/group.schema";

@Injectable()
export default class GroupReponsitory extends BaseRepository<GroupDocument>{
    constructor(@InjectModel(Group.name)   model: Model<GroupDocument>) {
        super(model);
    }
  }
  