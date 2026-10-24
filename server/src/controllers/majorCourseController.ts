import type { Request, Response } from 'express';
import MajorCourseService from '../services/majorCourseService.js';
import { CreateMajorCourseDTO, UpdateMajorCourseDTO } from '../dto/majorCourseDTO.js';

export class MajorCourseController {
  async create(req: Request, res: Response) {
    const data = CreateMajorCourseDTO.parse(req.body);
    const majorCourse = await MajorCourseService.create(data);

    return res.status(201).json(majorCourse);
  }

  async update(req: Request, res: Response) {
    const majorId = Number(req.params.majorId);
    const courseId = Number(req.params.courseId);
    const data = UpdateMajorCourseDTO.parse(req.body);
    const majorCourse = await MajorCourseService.update(majorId, courseId, data);

    return res.status(200).json(majorCourse);
  }

  async get(req: Request, res: Response) {
    const majorId = Number(req.params.majorId);
    const courseId = Number(req.params.courseId);
    const majorCourse = await MajorCourseService.get(majorId, courseId);

    return res.status(200).json(majorCourse);
  }

  async getAll(req: Request, res: Response) {
    const majorCourses = await MajorCourseService.getAll();

    return res.status(200).json(majorCourses);
  }

  async getByMajor(req: Request, res: Response) {
    const majorId = Number(req.params.majorId);
    const majorCourses = await MajorCourseService.getByMajor(majorId);

    return res.status(200).json(majorCourses);
  }

  async delete(req: Request, res: Response) {
    const majorId = Number(req.params.majorId);
    const courseId = Number(req.params.courseId);
    await MajorCourseService.delete(majorId, courseId);

    return res.status(204).send();
  }
}

export default new MajorCourseController();
