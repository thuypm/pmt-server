import  UserRepository  from '../../reponsitories/UserRepository';
import { UserSchema, User } from '../../schema/user.schema';
import { GroupController } from '../group/group.controller';
import {  Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [GroupController],
    providers: [GroupService,GroupReponsitory, UserRepository, AuthService],
    exports: [GroupService,GroupReponsitory, UserRepository],
})
export class UserModule{ 
}
