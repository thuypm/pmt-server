import {
  Body,
  Controller,
  HttpStatus,
  Request,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
  Headers,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  async getUser(@Req() req: Request, @Headers('authorization') auth: string) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.userService.getUserYourSelf(user.username);
  }
  @Post('/change-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp',
        filename: (req, file, callback) => {
          callback(null, uuid());
        },
      }),
      fileFilter: null,
    }),
  )
  async handleChangeAvatar(@UploadedFile() file: Express.Multer.File, @Headers('authorization') auth: string) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.userService.saveAvatar(file, user);
  }
  @Get('/find-user')
  async findUser(
    @Req() req: Request,
    @Headers('authorization') auth: string,
    @Query() query: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    const listResult = await this.userService.findUser(query);
    const resp = listResult.filter((e) => e.username !== user.username);
    return resp;
  }
}
