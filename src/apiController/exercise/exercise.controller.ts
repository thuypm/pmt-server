import {
  Body,
  Controller,
  HttpStatus,
  Query,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
  Headers,
  Param,
  Put,
  HttpException,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDecodeToken } from 'src/dto/user.dto';
import { CreateExerciseDto, ExerciseDto } from 'src/dto/exercise.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Controller('/exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly authService: AuthService,
  ) {}
  @Get('')
  async getAllExercise(
    @Body() body: ExerciseDto,
    @Query() query: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    const group_id: string = query?.group_id;
    return await this.exerciseService.getAllExercise(group_id, user);
  }
  @Get(':id')
  async getOneExercise(
    @Body() body: ExerciseDto,
    @Param() params: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    const ex_id: string = params?.id;
    return await this.exerciseService.getOneExercise(ex_id, user);
  }
  @Post('')
  async createExercise(
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const owner: UserDecodeToken = await this.authService.decodedToken(token);
    const exerciseCreate: CreateExerciseDto = {
      _id: null,
      name: body?.name,
      group_id: body?.group_id,
      description: body?.description,
      deadline: body?.deadline,
      owner: {
        _id: owner._id,
        username: owner.username,
      },
      list_submit: [],
    };
    return await this.exerciseService.createExercise(exerciseCreate);
  }
  @Put(':id')
  async editOneExercise(
    @Body() body: ExerciseDto,
    @Param() params: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const owner: UserDecodeToken = await this.authService.decodedToken(token);
    const ex_id: string = params?.id;
    const exerciseEdit: CreateExerciseDto = {
      _id: null,
      name: body?.name,
      group_id: body?.group_id,
      description: body?.description,
      deadline: body?.deadline,
      owner: {
        _id: owner._id,
        username: owner.username,
      },
      list_submit: [],
    };
    return await this.exerciseService.updateExercise(ex_id, exerciseEdit);
  }
  @Patch('submit/:id')
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
  async submitFile(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.exerciseService.submitExercise(file, params?.id, user);
  }
  @Delete(':id')
  async deleteExercise(
    @Param() params: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.exerciseService.deleteExercise(params?.id, user);
  }
  @Patch('evaluate/:id')
  async evaluateSubmit(
    @Param() params: any,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    const token = auth.replace('Bearer ', '');
    const user: UserDecodeToken = await this.authService.decodedToken(token);
    return await this.exerciseService.evaluateExercise(params?.id, user, {
      point: body?.point,
      evaluate: body?.evaluate,
      _id: body?._id,
    });
  }
}
