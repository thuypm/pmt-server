import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDecodeToken, UserDto } from 'src/dto/user.dto';
import UserRepository from '../../reponsitories/UserRepository';
import { Types } from 'mongoose';
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { CreateGroupDto, GroupDto } from 'src/dto/group.dto';
import { Notice } from 'src/dto/notice.dto';
import { NotificationGateway } from 'src/socket/Notification';
import * as fs from 'fs';
import { CreateExerciseDto, ExerciseDto } from 'src/dto/exercise.dto';
import ExerciseRepository from 'src/reponsitories/ExerciseRepository';
import BaseRepository from 'src/reponsitories/BaseRepository';
import { v4 as uuid } from 'uuid';
import { SubmitDto } from 'src/dto/submit.dto';
import * as path from 'path';

@Injectable()
export class ExerciseService {
  constructor(
    private exerciseRepo: ExerciseRepository,
    private groupRepo: GroupReponsitory,
    private noti: NotificationGateway,
  ) {}

  async checkForbidden(
    any_id: string,
    repo: BaseRepository<any>,
    callback: () => any,
  ) {
    let id_find: Types.ObjectId;
    try {
      id_find = Types.ObjectId(any_id);
      let result: any;
      if (callback) result = callback();
      else {
        result = await repo.findOne({ _id: id_find });
      }
      if (result) return result;
      else
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errors: [
              {
                label: 'Lỗi',
                content: 'Id không hợp lệ',
              },
            ],
          },
          HttpStatus.BAD_REQUEST,
        );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: [
            {
              label: 'Lỗi',
              content: 'Id không hợp lệ',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createExercise(exercise: CreateExerciseDto) {
    let groupFind: GroupDto;
    try {
      groupFind = await this.checkForbidden(
        exercise?.group_id?.toString(),
        this.groupRepo,
        null,
      );
    } catch (error) {
      throw error;
    }
    if (groupFind?.owner?.username !== exercise?.owner?.username) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn không có quyền chỉnh sửa',
            },
          ],
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      exercise._id = Types.ObjectId();
      exercise.group_id = groupFind._id;
      await this.exerciseRepo.create(exercise);
      let noti: Notice = new Notice();
      noti = {
        id: null,
        title: 'Bài tập mới',
        status: false,
        time: new Date().getTime(),
        action: '/group-exercise',
        content: exercise.owner.username + ' đã tạo bài tập ' + exercise.name,
      };

      await fs.mkdir('./public/exercise/' + exercise._id, function (err) {
        if (err) {
          return console.error(err);
        }
      });
      groupFind.members.forEach(async (e) => {
        // await this.userRepo.update({ _id: Types.ObjectId(e._id.toString()), username: e.username }, {
        //   $push: {
        //     exercise_ids: exercise._id,
        //   },
        // })
        this.noti.pushNotiToClient([e.username], noti);
      });
      return {};
    }
  }
  async getAllExercise(group_id: string, user: UserDecodeToken) {
    let groupFind: GroupDto;
    try {
      groupFind = await this.checkForbidden(group_id, this.groupRepo, null);
      if (
        groupFind?.owner?.username === user.username ||
        groupFind?.members?.find((e) => e.username === user.username)
      ) {
        return await this.exerciseRepo.getAllExerciseShow({
          group_id: groupFind._id,
        });
      } else
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            errors: [
              {
                label: 'Lỗi',
                content: 'Bạn không có quyền xem trang này',
              },
            ],
          },
          HttpStatus.FORBIDDEN,
        );
    } catch (error) {
      throw error;
    }
  }
  async getOneExercise(id: string, user: UserDecodeToken) {
    let exerciseFind: ExerciseDto;
    try {
      exerciseFind = await this.checkForbidden(id, this.exerciseRepo, null);
      if (exerciseFind) {
        const groupFind: GroupDto = await this.groupRepo.findOne({
          _id: exerciseFind.group_id,
        });
        if (groupFind?.owner?.username === user.username) return exerciseFind;
        if (groupFind?.members?.find((e) => e.username === user.username)) {
          const objectResponse: ExerciseDto = {
            _id: exerciseFind._id,
            owner: exerciseFind.owner,
            name: exerciseFind.name,
            deadline: exerciseFind.deadline,
            description: exerciseFind.description,
            group_id: exerciseFind.group_id,
            list_submit: exerciseFind.list_submit.filter(
              (e) => e?.owner?.username === user.username,
            ),
          };
          return objectResponse;
        } else
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              errors: [
                {
                  label: 'Lỗi',
                  content: 'Bạn không có quyền xem trang này',
                },
              ],
            },
            HttpStatus.FORBIDDEN,
          );
      }
      return exerciseFind;
    } catch (error) {
      throw error;
    }
  }
  async updateExercise(id: string, exerciseEdit: ExerciseDto) {
    let exerciseFind: ExerciseDto;
    try {
      exerciseFind = await this.checkForbidden(id, this.exerciseRepo, null);
    } catch (error) {
      throw error;
    }
    if (exerciseFind?.owner?.username !== exerciseEdit?.owner?.username) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn không có quyền chỉnh sửa',
            },
          ],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.exerciseRepo.update(
      { _id: exerciseFind._id },
      {
        name: exerciseEdit.name,
        description: exerciseEdit.description,
        deadline: exerciseEdit.deadline,
      },
    );
  }
  async submitExercise(
    file: Express.Multer.File,
    exercise_id: string,
    user: UserDecodeToken,
  ) {
    let exerciseFind: ExerciseDto;
    try {
      exerciseFind = await this.checkForbidden(
        exercise_id,
        this.exerciseRepo,
        null,
      );
      const pathFile =
        './public/exercise/' +
        exercise_id +
        '/' +
        file.filename +
        path.extname(file.originalname);
      await fs.renameSync(file?.path, pathFile);
      const newSubmit: SubmitDto = {
        _id: uuid(),
        link_file: pathFile.replace('./public/', ''),
        name_file: file.originalname,
        owner: user,
        time_submit: new Date().getTime(),
        point: null,
        evaluate: '',
      };
      return await this.exerciseRepo.update(
        { _id: exerciseFind._id },
        {
          $push: {
            list_submit: newSubmit,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
  async evaluateExercise(id: string, user: UserDecodeToken, evaluateData: any) {
    let exerciseFind: ExerciseDto;
    try {
      exerciseFind = await this.checkForbidden(id, this.exerciseRepo, null);
    } catch (error) {
      throw error;
    }
    if (exerciseFind?.owner?.username !== user.username) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn không có quyền chỉnh sửa',
            },
          ],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.exerciseRepo.update(
      { _id: exerciseFind._id, 'list_submit._id': evaluateData?._id },
      {
        $set: {
          'list_submit.$.point': evaluateData?.point,
          'list_submit.$.evaluate': evaluateData?.evaluate,
        },
      },
    );
  }
  async deleteExercise(id: string, user: UserDecodeToken) {
    let exerciseFind: ExerciseDto;
    try {
      exerciseFind = await this.checkForbidden(id, this.exerciseRepo, null);
    } catch (error) {
      throw error;
    }
    if (exerciseFind?.owner?.username !== user.username) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn không có quyền chỉnh sửa',
            },
          ],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    await this.exerciseRepo.delete({ _id: exerciseFind._id });
    await fs.rmdirSync('./public/exercise/' + exerciseFind._id);
    return {};
  }
}
