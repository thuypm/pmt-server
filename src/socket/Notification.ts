import { Inject } from "@nestjs/common";
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

@WebSocketGateway({ namespace: 'notification' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server;
    async handleConnection(client: Client, ...args: any[]) {
        // console.log('conneted');
        console.log('connected');
    }
    async handleDisconnect(client: Socket) {
        console.log('disconneted')
    }
    async afterInit(server: Socket) {
        // console.log(server);
        // console.log('conneted')
    }
    @SubscribeMessage('vip')
    public async handleEmit(@MessageBody() data: any) {
        console.log(data)
    }
    // @Inject()
    // private messageService

}