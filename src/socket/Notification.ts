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
import { Server, Socket, Client } from "socket.io";
import { AuthService } from "src/apiController/auth/auth.service";
import { Notice } from "src/dto/notice.dto";
import { UserDecodeToken } from "src/dto/user.dto";

@Injectable()
@WebSocketGateway({ namespace: 'notification' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server;

    constructor(private readonly authService: AuthService) {
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
    async pushNotiToClient(room: string, noti: Notice ) {
        this.wss.to(room).emit("notification", noti);
    }
    // @SubscribeMessage('vip')
    // public async handleEmit(@MessageBody() data: any) {
    //     console.log(data)
    // }
    // @Inject()
    // private messageService

}