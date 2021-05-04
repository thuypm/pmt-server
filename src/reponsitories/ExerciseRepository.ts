import { Model, Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/dto/message.dto';
import { Exercise, ExerciseDocument } from 'src/schema/exercise.schema';

@Injectable()
export default class ExerciseRepository extends BaseRepository<ExerciseDocument> {
  constructor(@InjectModel(Exercise.name) model: Model<ExerciseDocument>) {
    super(model);
  }
  async getAllExerciseShow(query) {
    return await this.model
      .find({
        ...query,
      })
      .select({ name: 1, _id: 1, description: 1, owner: 1, deadline: 1 });
  }
}
