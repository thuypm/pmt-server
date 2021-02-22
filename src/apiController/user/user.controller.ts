import { Body, Controller, HttpStatus, Request, Post, Req, Res, Get, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';


@Controller("/user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {

  }

  @Get()
  async getUser(@Req() req: Request, @Headers('authorization') auth: string) {
    let token = auth.replace('Bearer ','');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.userService.getUserYourSelf(user.username);
  }

}

