import { Request, Response } from 'express';
import CourseStatusService from '../services/courseStatusService.js';
import { CourseStatusDTO } from '../dto/courseStatusDTO.js';

export class CourseStatusController {
  async courseStatus(req: Request, res: Response) {
    const data = CourseStatusDTO.parse(req.body);
    const courseValidation = await CourseStatusService.courseStatus(data);

    return res.status(200).json(courseValidation);
  }
}

export default new CourseStatusController();
