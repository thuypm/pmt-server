import { Body, Controller, HttpStatus, Query, Post, Req, Res, Get, UseGuards, Headers, Param, Put, HttpException, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'
import { PostDto } from 'src/dto/post.dto';


@Controller("/post")
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService, private readonly authService: AuthService) {

  }
  // @Get('')
  // async getAllPost(@Query() query: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const user: UserDecodeToken = await this.authService.decodedToken(token);
  //   let group_id: string = query?.group_id;
  //   return await this.postService.getAllPost(group_id, user);
  // }
  // @Get(':id')
  // async getOneExercise(@Body() body: ExerciseDto, @Param() params: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const user: UserDecodeToken = await this.authService.decodedToken(token);
  //   let ex_id: string = params?.id;
  //   return await this.postService.getOneExercise(ex_id, user);
  // }
  // @Post("")
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './tmp',
  //     filename: (req, file, callback) => {
  //       callback(null, uuid())
  //     },
  //   }),
  //   fileFilter: null,
  // }))
  // async createPost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const owner: UserDecodeToken = await this.authService.decodedToken(token);
  //   let postCreate: PostDto = {
  //     _id: null,
  //     content: body?.content,
  //     group_id: body?.group_id,
  //     filePath: '',
  //     file_type: '',
  //     list_comment: [],
  //     owner: {
  //       _id: owner._id,
  //       username: owner.username
  //     },
  //     time: new Date().getTime(),
  //   }
  //   return await this.postService.createPost(postCreate, file);
  // }
  // @Put(':id')
  // async editOneExercise(@Body() body: ExerciseDto, @Param() params: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const owner: UserDecodeToken = await this.authService.decodedToken(token);
  //   let ex_id: string = params?.id;
  //   let exerciseEdit: CreateExerciseDto = {
  //     _id: null,
  //     name: body?.name,
  //     group_id: body?.group_id,
  //     description: body?.description,
  //     deadline: body?.deadline,
  //     owner: {
  //       _id: owner._id,
  //       username: owner.username
  //     },
  //     list_submit: [],
  //   }
  //   return await this.postService.updateExercise(ex_id, exerciseEdit);
  // }
  // @Patch('submit/:id')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './tmp',
  //     filename: (req, file, callback) => {
  //       callback(null, uuid())
  //     },
  //   }),
  //   fileFilter: null,
  // }))
  // async submitFile(@UploadedFile() file: Express.Multer.File, @Param() params: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const user: UserDecodeToken = await this.authService.decodedToken(token);
  //   return await this.postService.submitExercise(file, params?.id, user);
  // }
  // @Delete(':id')
  // async deleteExercise(@Param() params: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const user: UserDecodeToken = await this.authService.decodedToken(token);
  //   return await this.postService.deleteExercise(params?.id, user);
  // }
  // @Patch('evaluate/:id')
  // async evaluateSubmit(@Param() params: any, @Body() body: any, @Headers('authorization') auth: string) {
  //   let token = auth.replace('Bearer ', '');
  //   const user: UserDecodeToken = await this.authService.decodedToken(token);
  //   return await this.postService.evaluateExercise(params?.id, user, {
  //     point: body?.point,
  //     evaluate: body?.evaluate,
  //     _id: body?._id
  //   });
  // }
}

