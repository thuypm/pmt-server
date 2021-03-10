
import { Model, Types, } from 'mongoose';
import BaseRepository from "./BaseRepository";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupDocument, Group } from "src/schema/group.schema";

@Injectable()
export default class GroupReponsitory extends BaseRepository<GroupDocument>{
    constructor(@InjectModel(Group.name) model: Model<GroupDocument>) {
        super(model);
    }
    async getListGroupOfUser(list_ids: Array<Types.ObjectId>) {
        return await this.model.find({
            '_id': {
                $in: list_ids
            }
        }).select({ name: 1, _id: 1, owner: 1 }).limit(20);
    }
}
