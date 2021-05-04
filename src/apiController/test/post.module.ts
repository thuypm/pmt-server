import UserRepository from 'src/reponsitories/UserRepository';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';

import { GroupSchema, Group } from '../../schema/group.schema';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { PostController } from './post.controller';
import PostRepository from 'src/reponsitories/PostRepository';
import { Post, PostSchema } from 'src/schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    GroupReponsitory,
    UserService,
    UserRepository,
    AuthService,
  ],
  exports: [PostRepository, PostService],
})
export class PostModule {}
