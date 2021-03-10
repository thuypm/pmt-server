import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/apiController/auth/auth.service';
import UserRepository from 'src/reponsitories/UserRepository';
import { NotificationGateway } from 'src/socket/Notification';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRATION }
      })
    }),
  ],
  providers: [AuthService, NotificationGateway],
  exports: [JwtModule, NotificationGateway]
})
export class CoreModule { }