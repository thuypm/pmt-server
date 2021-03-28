import { Inject, Injectable } from "@nestjs/common";
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket, Client } from "socket.io";
import { AuthService } from "src/apiController/auth/auth.service";
import { GroupDto } from "src/dto/group.dto";
import { Notice } from "src/dto/notice.dto";
import { UserDecodeToken } from "src/dto/user.dto";
import GroupReponsitory from "src/reponsitories/GroupReponsitory";

@Injectable()
@WebSocketGateway({ namespace: 'notification' })
export class PostGateway implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server;

    constructor(private readonly authService: AuthService, private readonly groupRepo: GroupReponsitory) {
    }
    async handleConnection(client: Socket, ...args: any[]) {
        let token: string = client?.handshake?.query?.authorization.replace('Bearer ', '');
        let user: UserDecodeToken = await this.authService.decodedToken(token);
        client.join(user.username);
    }
    async handleDisconnect(client: Socket) {
        console.log('disconneted')
    }
    async afterInit(server: Socket) {
        // console.log(server);
    }
    @SubscribeMessage('join-room')
    public async handleJoinRoom(client: Socket, data: string): Promise<string> {
        client.join(data);
        let group: GroupDto = await this.groupRepo.findOne({ _id: Types.ObjectId(data) });
        if (group) {
            client.emit('load-group-data', group);
        }
        return data
    }
    @SubscribeMessage('send-message')
    public async handleSendMessage(client: Socket, data: any): Promise<string> {
        client.join(data?.room);
        await this.groupRepo.update({ _id: Types.ObjectId(data)}, {
            $push:{
                listMesssage: data?.message
            }
        });

        // if (group) {
        //     client.emit('load-group-data', group);
        // }
        return data
    }
    // @Inject()
    // private messageService

}