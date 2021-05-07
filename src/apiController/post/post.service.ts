import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDecodeToken } from 'src/dto/user.dto';
import { Types } from 'mongoose'
import GroupReponsitory from 'src/reponsitories/GroupReponsitory';
import { GroupDto } from 'src/dto/group.dto';
import { Notice } from 'src/dto/notice.dto';
import { NotificationGateway } from 'src/socket/Notification';
import * as fs from 'fs'
import PostRepository from 'src/reponsitories/PostRepository';
import BaseRepository from 'src/reponsitories/BaseRepository';
import { v4 as uuid } from 'uuid'
import * as path from 'path'
import { PostDto } from 'src/dto/post.dto';
import { CommentDto } from 'src/dto/comment.dto';
// import { PostGateway } from 'src/socket/Post';

@Injectable()
export class PostService {
  constructor(
    private postRepo: PostRepository,
    private groupRepo: GroupReponsitory,
    private noti: NotificationGateway,
    // private postGateway: PostGateway
  ) {
  };

  async checkForbidden(any_id: string, repo: BaseRepository<any>, callback: () => any) {
    let id_find: Types.ObjectId;
    try {
      id_find = Types.ObjectId(any_id);
      let result: any;
      if (callback)
        result = callback();
      else {
        result = await repo.findOne({ _id: id_find })
      }
      ;
      if (result)
        return result;
      else
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          errors: [
            {
              label: 'Lỗi',
              content: 'Id không hợp lệ'
            }
          ],
        }, HttpStatus.BAD_REQUEST)

    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            label: 'Lỗi',
            content: 'Id không hợp lệ'
          }
        ],
      }, HttpStatus.BAD_REQUEST)
    }
  }

  async createPost(postCreate: PostDto) {
    let groupFind: GroupDto;
    try {
      groupFind = await this.checkForbidden(postCreate?.group_id?.toString(), this.groupRepo, null);
    } catch (error) {
      throw error
    }
    if (groupFind?.owner?.username !== postCreate?.owner?.username && !groupFind?.members?.find(e => e.username === postCreate.owner.username)) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        errors: [
          {
            label: 'Lỗi',
            content: 'Bạn không có quyền chỉnh sửa'
          }
        ],
      }, HttpStatus.FORBIDDEN);
    }
    else {
      postCreate._id = Types.ObjectId();
      postCreate.group_id = groupFind._id;
      await this.postRepo.create(postCreate);
      let noti: Notice = new Notice();
      noti = {
        id: null,
        title: "Bài viết mới",
        status: false,
        time: new Date().getTime(),
        action: "/all-group",
        content: postCreate.owner.username + " đã đăng trong nhóm " + groupFind.name
      }
      groupFind.members.forEach(async e => {
        if (e.username !== postCreate.owner?.username)
          this.noti.pushNotiToClient([e.username], noti);
      })
      if (groupFind.owner.username !== postCreate.owner.username) {
        this.noti.pushNotiToClient([groupFind.owner.username], noti)
      }
      return {}
    }

  }
  async getAllPost(group_id: string, user: UserDecodeToken) {
    let groupFind: GroupDto;
    try {
      groupFind = await this.checkForbidden(group_id, this.groupRepo, null);
      if (groupFind?.owner?.username === user.username || groupFind?.members?.find(e => e.username === user.username)) {
        return this.postRepo.findAll({ group_id: groupFind._id })
      }
      else
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              label: 'Lỗi',
              content: 'Bạn không có quyền xem trang này'
            }
          ],
        }, HttpStatus.FORBIDDEN);

    } catch (error) {
      throw error
    }
  }
  async commentPost(post_id: string, comment: CommentDto) {
    return await this.postRepo.update({ _id: Types.ObjectId(post_id) }, {
      $push: {
        list_comment: comment
      }
    })
  }
  // async getOneExercise(id: string, user: UserDecodeToken) {
  //   let exerciseFind: ExerciseDto;
  //   try {
  //     exerciseFind = await this.checkForbidden(id, this.postRepo, null);
  //     if (exerciseFind) {
  //       let groupFind: GroupDto = await this.groupRepo.findOne({ _id: exerciseFind.group_id });
  //       if (groupFind?.owner?.username === user.username)
  //         return exerciseFind;
  //       if (groupFind?.members?.find(e => e.username === user.username)) {
  //         let objectResponse: ExerciseDto = {
  //           _id: exerciseFind._id,
  //           owner: exerciseFind.owner,
  //           name: exerciseFind.name,
  //           deadline: exerciseFind.deadline,
  //           description: exerciseFind.description,
  //           group_id: exerciseFind.group_id,
  //           list_submit: exerciseFind.list_submit.filter(e => e?.owner?.username === user.username)
  //         }
  //         return objectResponse
  //       }
  //       else
  //         throw new HttpException({
  //           status: HttpStatus.FORBIDDEN,
  //           errors: [
  //             {
  //               label: 'Lỗi',
  //               content: 'Bạn không có quyền xem trang này'
  //             }
  //           ],
  //         }, HttpStatus.FORBIDDEN);
  //     }
  //     return exerciseFind;
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // async updateExercise(id: string, exerciseEdit: ExerciseDto) {
  //   let exerciseFind: ExerciseDto;
  //   try {
  //     exerciseFind = await this.checkForbidden(id, this.postRepo, null);
  //   } catch (error) {
  //     throw error
  //   }
  //   if (exerciseFind?.owner?.username !== exerciseEdit?.owner?.username) {
  //     throw new HttpException({
  //       status: HttpStatus.FORBIDDEN,
  //       errors: [
  //         {
  //           label: 'Lỗi',
  //           content: 'Bạn không có quyền chỉnh sửa'
  //         }
  //       ],
  //     }, HttpStatus.FORBIDDEN);
  //   }
  //   return await this.postRepo.update({ _id: exerciseFind._id }, {
  //     name: exerciseEdit.name,
  //     description: exerciseEdit.description,
  //     deadline: exerciseEdit.deadline
  //   });
  // }
  // async submitExercise(file: Express.Multer.File, exercise_id: string, user: UserDecodeToken) {
  //   let exerciseFind: ExerciseDto;
  //   try {
  //     exerciseFind = await this.checkForbidden(exercise_id, this.postRepo, null);
  //     const pathFile = './public/exercise/' + exercise_id + '/' + file.filename + path.extname(file.originalname);
  //     await fs.renameSync(file?.path, pathFile);
  //     let newSubmit: SubmitDto = {
  //       _id: uuid(),
  //       link_file: pathFile.replace('./public/', ''),
  //       name_file: file.originalname,
  //       owner: user,
  //       time_submit: new Date().getTime(),
  //       point: null,
  //       evaluate: '',
  //     }
  //     return await this.postRepo.update({ _id: exerciseFind._id }, {
  //       $push: {
  //         list_submit: newSubmit
  //       }
  //     })
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // async evaluateExercise(id: string, user: UserDecodeToken, evaluateData: any) {
  //   let exerciseFind: ExerciseDto;
  //   try {
  //     exerciseFind = await this.checkForbidden(id, this.postRepo, null);
  //   } catch (error) {
  //     throw error
  //   }
  //   if (exerciseFind?.owner?.username !== user.username) {
  //     throw new HttpException({
  //       status: HttpStatus.FORBIDDEN,
  //       errors: [
  //         {
  //           label: 'Lỗi',
  //           content: 'Bạn không có quyền chỉnh sửa'
  //         }
  //       ],
  //     }, HttpStatus.FORBIDDEN);
  //   }
  //   return await this.postRepo.update({ _id: exerciseFind._id, "list_submit._id": evaluateData?._id }, {
  //     $set: {
  //       'list_submit.$.point': evaluateData?.point,
  //       'list_submit.$.evaluate': evaluateData?.evaluate,
  //     }
  //   });
  // }
  // async deleteExercise(id: string, user: UserDecodeToken) {
  //   let exerciseFind: ExerciseDto;
  //   try {
  //     exerciseFind = await this.checkForbidden(id, this.postRepo, null);

  //   } catch (error) {
  //     throw error
  //   }
  //   if (exerciseFind?.owner?.username !== user.username) {
  //     throw new HttpException({
  //       status: HttpStatus.FORBIDDEN,
  //       errors: [
  //         {
  //           label: 'Lỗi',
  //           content: 'Bạn không có quyền chỉnh sửa'
  //         }
  //       ],
  //     }, HttpStatus.FORBIDDEN);
  //   }
  //   await this.postRepo.delete({ _id: exerciseFind._id });
  //   await fs.rmdirSync('./public/exercise/' + exerciseFind._id);
  //   return {}
  // }
}
