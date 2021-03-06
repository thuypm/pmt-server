import { BaseDocument, BaseModel } from "../schema/base.schema";
import { Model, Schema, Types } from 'mongoose';
import { UserDocument, UserSchema } from "../schema/user.schema"
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export default class BaseRepository<D extends BaseDocument>{
  protected model: Model<D>;
  constructor(model: Model<D>) {
    this.model = model;
  }
  async create(data: any) {
    return await this.model.create(data);
  }
  
  async update( data :any , option:any ) {
    return await this.model.updateOne(data, option);
  }

  async delete(option) {
    return await this.model.remove(option);
  }

  async findAll(condition) {
    return this.model.find(condition ? condition : {});
  }

  async findOne(option) {
    return await this.model.findOne(option);
  }

  async getCountItems(option) {
    return await this.model.find().where(option).count();
  }

  async paginate({ limit, options, page }) {
    const count = await this.getCountItems(options);
    const perPage = limit && limit > 0 ? limit : 20;
    let currentPage = page && page > 0 ? page : 1;
    const totalPage = Math.ceil(count / perPage);
    currentPage =
      currentPage > totalPage && totalPage > 0 ? totalPage : currentPage;
    const skip = (currentPage - 1) * perPage;
    const data = await this.model
      .find()
      .where(options)
      .skip(skip)
      .limit(perPage);
    return {
      data,
      paginate: {
        totalPage,
        total: count,
        pageSize: perPage,
        currentPage: parseInt(currentPage),
      },
    };
  }
}
