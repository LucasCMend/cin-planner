import { CreateCourseInput, UpdateCourseInput } from '../dto/courseDTO.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import courseRepository from '../repositories/courseRepository.js';
import CourseRepository from '../repositories/courseRepository.js';

export class CourseService {
  async create(data: CreateCourseInput) {
    const course = await CourseRepository.create(data);
    return course;
  }

  async update(id: number, data: UpdateCourseInput) {
    const course = await CourseRepository.get(id);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError();
    }

    const updatedCourse = await courseRepository.update(id, data);
    return updatedCourse;
  }

  async get(id: number) {
    const course = await CourseRepository.get(id);
    return course;
  }

  async getAll() {
    const courses = await CourseRepository.getAll();
    return courses;
  }

  async getByCode(code: string) {
    const course = await CourseRepository.getByCode(code);
    return course;
  }

  async delete(id: number) {
    const course = await CourseRepository.delete(id);
    return course;
  }
}

export default new CourseService();
