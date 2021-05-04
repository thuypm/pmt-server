import { Types } from 'mongoose';
import { SubmitDto } from './submit.dto';
import { UserDecodeToken } from './user.dto';

export class ExerciseDto {
  _id: string | Types.ObjectId;
  group_id: string | Types.ObjectId;
  description: string;
  name: string;
  deadline: number;
  list_submit: Array<SubmitDto>;
  owner: UserDecodeToken;
}
export class CreateExerciseDto {
  _id: string | Types.ObjectId;
  group_id: string | Types.ObjectId;
  description: string;
  name: string;
  deadline: number;
  list_submit: [];
  owner: UserDecodeToken;
}
