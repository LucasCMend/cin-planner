import type { Request, Response } from 'express';
import UserCourseService from '../services/userCourseService.js';
import { CreateUserCourseDTO, UpdateUserCourseDTO } from '../dto/userCourseDTO.js';

export class UserCourseController {
  async create(req: Request, res: Response) {
    const data = CreateUserCourseDTO.parse(req.body);
    const userCourse = await UserCourseService.create(data);

    return res.status(201).json(userCourse);
  }

  async update(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);
    const data = UpdateUserCourseDTO.parse(req.body);
    const userCourse = await UserCourseService.update(userId, courseId, data);

    return res.status(200).json(userCourse);
  }

  async get(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);
    const userCourse = await UserCourseService.get(userId, courseId);

    return res.status(200).json(userCourse);
  }

  async getAll(req: Request, res: Response) {
    const userCourses = await UserCourseService.getAll();

    return res.status(200).json(userCourses);
  }

  async getByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const userCourses = await UserCourseService.getByUser(userId);

    return res.status(200).json(userCourses);
  }

  async delete(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);
    await UserCourseService.delete(userId, courseId);

    return res.status(204).send();
  }
}

export default new UserCourseController();
