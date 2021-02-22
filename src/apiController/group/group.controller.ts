import { Body, Controller, HttpStatus, Request, Post, Req, Res, Get, UseGuards, Headers } from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';
import { CreateGroupDto } from 'src/dto/group.dto';


@Controller("/group")
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService, private readonly authService: AuthService) {

  }

  @Post()
  async createGroup(@Body() group: CreateGroupDto, @Headers('authorization') auth: string) {
    return await this.groupService.createGroup(group);
  }

}

