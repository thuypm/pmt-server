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

@Injectable()
@WebSocketGateway({ namespace: 'meeting' })
export class MeetingGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(private readonly authService: AuthService) { }
  async handleConnection(client: Socket, ...args: any[]) {
    // this.wss.on("disconectting", (client)=>{
    //     console.log(client.server)
    // })
  }
  async handleDisconnect(client: Socket) {
    this.wss.emit('disconnected', client.id);
  }
  async afterInit(server: Socket) { }
  @SubscribeMessage('join-room')
  public async handleJoinRoom(client: Socket, data: any): Promise<boolean> {
    client.join(data?.roomId);
    this.wss.to(data?.roomId).emit('new-client', {
      clientId: client.id,
      username: data?.username,
    });
    return true;
  }
  @SubscribeMessage('share-screen')
  public async handleShareScreen(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data?.group_id).emit('start-share-screen', data?.data);
    return true;
  }
  @SubscribeMessage('stop-share-creen')
  public async handleStopShareScreen(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data?.group_id).emit('stop-share-screen');
    return true;
  }
  @SubscribeMessage('res-new-client')
  public async handleResNewClient(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data?.socketId).emit('res-new-client', {
      clientId: data?.clientId,
      username: data?.username,
    });
    return true;
  }
  @SubscribeMessage('on-video')
  public async handleOnvideo(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data?.clientId).emit('on-video', {
      clientId: client.id,
      socketId: data?.clientId,
      token: data?.token,
      username: data?.username,
    });
    return true;
  }
  @SubscribeMessage('off-video')
  public async handleOffvideo(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data.roomId).emit('off-video', {
      clientId: client.id,
      username: data?.username,
    });
    return true;
  }
  @SubscribeMessage('res-on-video')
  public async handleResOnvideo(client: Socket, data: any): Promise<boolean> {
    this.wss.to(data?.socketId).emit('res-on-video', {
      clientId: client?.id,
      token: data?.token,
      username: data?.username,
    });
    return true;
  }
}
