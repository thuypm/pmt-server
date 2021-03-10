import {  Global, Module  } from '@nestjs/common';;
import { ConfigModule } from '@nestjs/config';
import {  JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './apiController/auth/auth.module';
import { GateModule } from './apiController/gate/gate.module';
import { UserModule } from './apiController/user/user.module';
import { GroupModule } from './apiController/group/group.module';
import { CoreModule } from './coreModule/core.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true , envFilePath: ".env"}),
    MongooseModule.forRoot(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CoreModule,
    AuthModule,
    GroupModule,
    UserModule,
    GateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

 }
