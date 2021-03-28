import { Global, Module } from '@nestjs/common';;
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './apiController/auth/auth.module';
import { GateModule } from './apiController/gate/gate.module';
import { UserModule } from './apiController/user/user.module';
import { GroupModule } from './apiController/group/group.module';
import { CoreModule } from './coreModule/core.module';
import { ChatGateway } from './socket/Chat';
import { MeetingGateway } from './socket/Meeting';
import { NotificationGateway } from './socket/Notification';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    MongooseModule.forRoot(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/v1*'],
    }),

    CoreModule,
    AuthModule,
    GroupModule,
    UserModule,
    GateModule,
  ],
  providers: [NotificationGateway, ChatGateway, MeetingGateway],
  exports: [NotificationGateway, ChatGateway]
})
export class AppModule {

}
