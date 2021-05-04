import UserRepository from '../../reponsitories/UserRepository';
import { UserSchema, User } from '../../schema/user.schema';
import { GateController } from './gate.controller';
import { Module } from '@nestjs/common';
import { GateService } from './gate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [GateController],
  providers: [GateService, UserRepository, AuthService],
  exports: [GateService],
})
export class GateModule {}
