import { Inject, Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket, Client } from 'socket.io';
import { AuthService } from 'src/apiController/auth/auth.service';
import { NotificationService } from 'src/apiController/notification/notification.service';
import { Notice } from 'src/dto/notice.dto';
import { UserDecodeToken } from 'src/dto/user.dto';

@Injectable()
@WebSocketGateway({ namespace: 'notification' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly notiService: NotificationService,
  ) {}
  async handleConnection(client: Socket, ...args: any[]) {
    const token: string = client?.handshake?.query?.authorization.replace(
      'Bearer ',
      '',
    );
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    client.join(user?.username);
  }
  async handleDisconnect(client: Socket) {
    console.log('disconneted');
  }
  async afterInit(server: Socket) {
    // console.log(server);
  }
  async pushNotiToClient(rooms: Array<string>, noti: Notice) {
    // console.log(rooms);
    rooms.forEach(async (room) => {
      await this.notiService.pushNotification(room, noti);
      this.wss.to(room).emit('notification', noti);
    });
  }
  @SubscribeMessage('read-notice')
  public async handleReadMessage(client: Socket, data: any) {
    const token: string = client?.handshake?.query?.authorization.replace(
      'Bearer ',
      '',
    );
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    await this.notiService.handleReadNotice(user, data);
  }
  @SubscribeMessage('read-all-notice')
  public async handleReadAllNotice(client: Socket, data: any) {
    const token: string = client?.handshake?.query?.authorization.replace(
      'Bearer ',
      '',
    );
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    await this.notiService.handleReadAllNotice(user);
    this.wss.to(user?.username).emit('read-all-notice');
  }
  // @Inject()
  // private messageService
}
