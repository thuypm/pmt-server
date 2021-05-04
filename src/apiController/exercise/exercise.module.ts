import UserRepository from 'src/reponsitories/UserRepository';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';

import { GroupSchema, Group } from '../../schema/group.schema';

import { GroupController } from '../group/group.controller';
import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { ExerciseController } from './exercise.controller';
import ExerciseRepository from 'src/reponsitories/ExerciseRepository';
import { Exercise, ExerciseSchema } from 'src/schema/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [ExerciseController],
  providers: [
    ExerciseController,
    ExerciseService,
    GroupReponsitory,
    UserService,
    UserRepository,
    ExerciseRepository,
    AuthService,
  ],
  exports: [ExerciseService, ExerciseRepository],
})
export class ExerciseModule {}
