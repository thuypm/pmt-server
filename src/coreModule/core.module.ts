import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/apiController/auth/auth.service';
import { GroupModule } from 'src/apiController/group/group.module';
import { UserModule } from 'src/apiController/user/user.module';
import UserRepository from 'src/reponsitories/UserRepository';
import { ChatGateway } from 'src/socket/Chat';
import { NotificationGateway } from 'src/socket/Notification';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [JwtModule],
})
export class CoreModule {}
