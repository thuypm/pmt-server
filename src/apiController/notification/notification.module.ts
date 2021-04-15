import UserRepository from 'src/reponsitories/UserRepository';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';

import { GroupSchema, Group } from '../../schema/group.schema';

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { NotificationController } from './notification.controller';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [NotificationController],
    providers: [NotificationService, UserRepository, AuthService],
    exports: [NotificationService],
})
export class NotificationModule {
}
