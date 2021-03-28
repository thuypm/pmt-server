import { Inject, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket, Client } from "socket.io";
import { AuthService } from "src/apiController/auth/auth.service";

@Injectable()
@WebSocketGateway({ namespace: 'meeting' })
export class MeetingGateway implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server;

    constructor(private readonly authService: AuthService) {
    }
    async handleConnection(client: Socket, ...args: any[]) {
    }
    async handleDisconnect(client: Socket) {
        // console.log('disconneted')
    }
    async afterInit(server: Socket) {
        // console.log(server);
    }
    @SubscribeMessage('join-room')
    public async handleJoinRoom(client: Socket, data: any): Promise<boolean> {
        console.log(data[1]);
        const roomId = data[0];
        const username = data[1];
        client.join(roomId);
        this.wss.to(roomId).emit('new-client', {
            socketId: client.id,
            username: username
        });
        return true
    }
    @SubscribeMessage('res-new-client')
    public async handleSendMessage(client: Socket, dataSocket: any): Promise<string> {
        console.log("re-render", client.id)
        this.wss.to(dataSocket?.clientId).emit("offer-token", dataSocket);
        return ''
    }
    @SubscribeMessage('answer-token')
    public async handleSendAnswerToken(client: Socket, dataSocket: any): Promise<string> {
        this.wss.to(dataSocket?.clientId).emit("answer-token", dataSocket);
        return ''
    }
    @SubscribeMessage('res-token')
    public async handleResToken(client: Socket, data: any): Promise<boolean> {
        const clientId = data[0];
        const token = data[1];
        this.wss.to(clientId).emit('res-token', {
            clientId: client.id,
            token: token
        });
        return true
    }

    // @Inject()
    // private messageService

}