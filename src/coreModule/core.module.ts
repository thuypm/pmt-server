import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/apiController/auth/auth.module';
import { AuthService } from 'src/apiController/auth/auth.service';

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
  providers:[],
  exports: [JwtModule]
})
export class CoreModule { }