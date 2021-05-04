import UserRepository from '../../reponsitories/UserRepository';
import { UserSchema, User } from '../../schema/user.schema';
import { UserController } from '../../apiController/user/user.controller';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
