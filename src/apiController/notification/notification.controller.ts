import {
  Body,
  Query,
  Controller,
  HttpStatus,
  Request,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
  Headers,
  Param,
  Put,
  HttpException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';
import { Types } from 'mongoose';

@Controller('/notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  async getAllNotification(
    @Query() query: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.notificationService.getAllNotification(
      user,
      parseInt(query?.page),
    );
  }
}
