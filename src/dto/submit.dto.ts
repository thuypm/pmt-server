import { UserDecodeToken } from './user.dto';

export class SubmitDto {
  _id: string;
  link_file: string;
  name_file: string;
  owner: UserDecodeToken;
  time_submit: number;
  point: number;
  evaluate: string;
}
