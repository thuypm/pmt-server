import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubmitDto } from 'src/dto/submit.dto';
import { UserDecodeToken } from 'src/dto/user.dto';
import { BaseModel } from './base.schema';

export type ExerciseDocument = Exercise & Document;

@Schema()
export class Exercise extends BaseModel {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  list_submit: Array<SubmitDto>;
  @Prop()
  owner: UserDecodeToken;
  @Prop()
  deadline: number;
  @Prop()
  group_id: Types.ObjectId;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
