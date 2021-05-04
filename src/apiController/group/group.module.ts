import UserRepository from 'src/reponsitories/UserRepository';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';

import { GroupSchema, Group } from '../../schema/group.schema';

import { GroupController } from '../group/group.controller';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupReponsitory,
    UserService,
    UserRepository,
    AuthService,
  ],
  exports: [GroupService, GroupReponsitory],
})
export class GroupModule {}
