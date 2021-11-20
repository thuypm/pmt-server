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
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Server, Socket, Client } from 'socket.io';
import { AuthService } from 'src/apiController/auth/auth.service';
import { PostService } from 'src/apiController/post/post.service';
import { PostDto } from 'src/dto/post.dto';
import { UserDecodeToken } from 'src/dto/user.dto';
import { CommentDto } from 'src/dto/comment.dto';

@WebSocketGateway({ namespace: 'post' })
@Injectable()
export class PostGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}
  async handleConnection(client: Socket, ...args: any[]) {
    const token: string = client?.handshake?.query?.authorization?.replace(
      'Bearer ',
      '',
    );
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    if (!user) client.emit('have-error');
  }
  async handleDisconnect(client: Socket) {
    console.log('disconneted');
  }
  async afterInit(server: Socket) {
    // console.log(server);
  }
  @SubscribeMessage('join-room')
  public async handleJoinRoom(client: Socket, group_id: string): Promise<any> {
    let token: string = client?.handshake?.query?.authorization?.replace(
      'Bearer ',
      '',
    );
    let user: UserDecodeToken = await this.authService.decodedToken(token);

    let list_post: Array<PostDto>;
    try {
      list_post = await this.postService.getAllPost(group_id, user);
      client.join(group_id);
      client.emit('get-all-post', list_post);
    } catch (error) {
      client.emit('have-error');
    }
    return 'list_post';
  }
  public async newPost(room: string, postContent: PostDto) {
    this.wss.to(room).emit('new-post', postContent);
  }
  @SubscribeMessage('create-post')
  public async handleCreatePost(client: Socket, dataSocket: any): Promise<any> {
    let token: string = client?.handshake?.query?.authorization?.replace(
      'Bearer ',
      '',
    );
    let user: UserDecodeToken = await this.authService.decodedToken(token);
    const group_id = dataSocket?.group_id;
    const content = dataSocket?.content;
    const file = dataSocket?.file;
    let fileName: string;
    let type: string;
    if (file) {
      const fileContent = file.content;
      const extension = fileContent.split(';')[0].split('/')[1];
      type = fileContent.split(';')[0].split('/')[0];
      const vtHead = fileContent.indexOf(',');
      const data = fileContent.slice(vtHead + 1, fileContent.length);
      fileName = uuid() + '.' + extension;
      await fs.writeFileSync(
        './public/group/' + group_id + '/' + fileName,
        data,
        { encoding: 'base64' },
      );
    }
    if (user) {
      let post: PostDto = {
        _id: null,
        content: content,
        filePath: file ? 'group/' + group_id + '/' + fileName : '',
        file_name: file?.name,
        file_type: type,
        owner: user,
        group_id: group_id,
        list_comment: [],
        time: new Date().getTime(),
      };
      await this.postService.createPost(post);
      this.wss.to(dataSocket?.group_id).emit('new-post', post);
      return 'list_post';
    } else return null;
  }
  @SubscribeMessage('post-comment')
  public async handlePostComment(client: Socket, data: any): Promise<any> {
    let token: string = client?.handshake?.query?.authorization?.replace(
      'Bearer ',
      '',
    );
    let user: UserDecodeToken = await this.authService.decodedToken(token);
    let cmt: CommentDto = {
      _id: uuid(),
      username: user?.username,
      content: data?.comment,
      time: new Date().getTime(),
    };
    await this.postService.commentPost(data?.post_id, cmt);
    this.wss.to(data.group_id).emit('new-comment', {
      post_id: data?.post_id,
      cmt: cmt,
    });
  }
}
