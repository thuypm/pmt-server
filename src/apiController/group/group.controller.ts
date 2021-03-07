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
    let token = auth.replace('Bearer ', '');
    const owner: UserDecodeToken = await this.authService.decodedToken(token);
    group.owner = {
      username: owner.username,
      _id: owner._id
    };
    let createG: CreateGroupDto = {
      _id: "",
      members: group?.members?.map(e => {
        return {
          _id: e._id,
          username: e.username
        }
      }),
      name: group.name,
      description: group.description,
      listPost: [],
      listMessage: [],
      owner: {
        username: owner.username,
        _id: owner._id
      }
    }
    await this.groupService.createGroup(createG);
    return {}
  }

}

