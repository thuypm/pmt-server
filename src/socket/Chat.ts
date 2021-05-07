import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket, Client } from 'socket.io';
import { AuthService } from 'src/apiController/auth/auth.service';
import { GroupDto } from 'src/dto/group.dto';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import PostRepository from 'src/reponsitories/PostRepository';
import { PostDto } from 'src/dto/post.dto';

@Injectable()
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly groupRepo: GroupReponsitory,
  ) { }
  async handleConnection(client: Socket, ...args: any[]) {
    // let token: string = client?.handshake?.query?.authorization.replace('Bearer ', '');
    // let user: UserDecodeToken = await this.authService.decodedToken(token);
    // client.join(user.username);
    // console.log("connected")
  }
  async handleDisconnect(client: Socket) {
    // console.log('disconneted')
  }
  async afterInit(server: Socket) {
    // console.log(server);
  }
  @SubscribeMessage('join-room')
  public async handleJoinRoom(client: Socket, data: string): Promise<string> {
    const group: GroupDto = await this.groupRepo.getAllMessage(
      Types.ObjectId(data),
    );
    console.log(data);
    if (group) {
      client.join(data);
      client.emit("load-all-user", [group.owner, ...group.members])
      client.emit('load-all-message', group.listMessage);
    } else {
      client.emit('not-found', 'Room not found');
    }
    return data;
  }
  @SubscribeMessage('send-message')
  public async handleSendMessage(
    client: Socket,
    dataSocket: any,
  ): Promise<string> {
    const roomId = dataSocket[0];
    const message = dataSocket[1];
    const file = dataSocket[2];
    if (file) {
      const fileContent = file.content;
      const extension = fileContent.split(';')[0].split('/')[1];
      const type = fileContent.split(';')[0].split('/')[0];
      const vtHead = fileContent.indexOf(',');
      const data = fileContent.slice(vtHead + 1, fileContent.length);
      const fileName = uuid() + '.' + extension;
      fs.writeFile(
        './public/group/' + roomId + '/' + fileName,
        data,
        { encoding: 'base64' },
        async (err) => {
          const messFile = {
            sender: message.sender,
            time: message.time,
            type: type,
            content: 'group/' + roomId + '/' + fileName + ':' + file.name,
          };
          await this.groupRepo.pushNewMessage(roomId, messFile);
          this.wss.to(roomId).emit('receive-message', messFile);
          if (message?.content != '') {
            await this.groupRepo.pushNewMessage(roomId, message);
            this.wss.to(roomId).emit('receive-message', message);
          }
        },
      );
    } else {
      if (message?.content != '') {
        await this.groupRepo.pushNewMessage(roomId, message);
        this.wss.to(roomId).emit('receive-message', message);
      }
    }
    return message;
  }

  // @Inject()
  // private messageService
}
