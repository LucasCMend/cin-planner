import type { Request, Response } from 'express';
import CoursePrerequisiteService from '../services/coursePrerequisiteService.js';
import { CreateCoursePrerequisiteDTO } from '../dto/coursePrerequisiteDTO.js';

export class CoursePrerequisiteController {
  async create(req: Request, res: Response) {
    const data = CreateCoursePrerequisiteDTO.parse(req.body);
    const prerequisite = await CoursePrerequisiteService.create(data);

    return res.status(201).json(prerequisite);
  }

  async get(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    const requiredCourseId = Number(req.params.requiredCourseId);
    const prerequisite = await CoursePrerequisiteService.get(courseId, requiredCourseId);

    return res.status(200).json(prerequisite);
  }

  async getAll(req: Request, res: Response) {
    const prerequisites = await CoursePrerequisiteService.getAll();

    return res.status(200).json(prerequisites);
  }

  async getByCourse(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    const prerequisites = await CoursePrerequisiteService.getByCourse(courseId);

    return res.status(200).json(prerequisites);
  }

  async delete(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    const requiredCourseId = Number(req.params.requiredCourseId);
    await CoursePrerequisiteService.delete(courseId, requiredCourseId);

    return res.status(204).send();
  }
}

export default new CoursePrerequisiteController();
