import { Model, Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/dto/message.dto';
import { Post, PostDocument } from 'src/schema/post.schema';

@Injectable()
export default class PostRepository extends BaseRepository<PostDocument> {
  constructor(@InjectModel(Post.name) model: Model<PostDocument>) {
    super(model);
  }
}
