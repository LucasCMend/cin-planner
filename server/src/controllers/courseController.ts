import type { Request, Response } from 'express';
import CourseService from '../services/courseService.js';
import { CreateCourseDTO, UpdateCourseDTO } from '../dto/courseDTO.js';

export class CourseController {
  async create(req: Request, res: Response) {
    const data = CreateCourseDTO.parse(req.body);
    const course = await CourseService.create(data);

    return res.status(201).json(course);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = UpdateCourseDTO.parse(req.body);
    const course = await CourseService.update(id, data);

    return res.status(200).json(course);
  }

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    const course = await CourseService.get(id);

    return res.status(200).json(course);
  }

  async getAll(req: Request, res: Response) {
    const courses = await CourseService.getAll();

    return res.status(200).json(courses);
  }

  async getByCode(req: Request, res: Response) {
    const code = String(req.params.code);
    const course = await CourseService.getByCode(code);

    return res.status(200).json(course);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await CourseService.delete(id);

    return res.status(204).send();
  }
}

export default new CourseController();
