import { CreateMajorCourseInput, UpdateMajorCourseInput } from '../dto/majorCourseDTO.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import CourseRepository from '../repositories/courseRepository.js';
import MajorCourseRepository from '../repositories/majorCourseRepository.js';
import MajorRepository from '../repositories/majorRepository.js';

export class MajorCourseService {
  async create(data: CreateMajorCourseInput) {
    const major = await MajorRepository.get(data.majorId);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    const course = await CourseRepository.get(data.courseId);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    const existing = await MajorCourseRepository.get(data.majorId, data.courseId);

    if (existing) {
      throw new ConflictError('Disciplina já vinculada a esse curso');
    }

    return await MajorCourseRepository.create(data);
  }

  async update(majorId: number, courseId: number, data: UpdateMajorCourseInput) {
    const majorCourse = await MajorCourseRepository.get(majorId, courseId);

    if (!majorCourse) {
      throw new NotFoundError('Vínculo entre curso e disciplina');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError();
    }

    return await MajorCourseRepository.update(majorId, courseId, data);
  }

  async get(majorId: number, courseId: number) {
    const majorCourse = await MajorCourseRepository.get(majorId, courseId);

    if (!majorCourse) {
      throw new NotFoundError('Vínculo entre curso e disciplina');
    }

    return majorCourse;
  }

  async getAll() {
    return await MajorCourseRepository.getAll();
  }

  async getByMajor(majorId: number) {
    const major = await MajorRepository.get(majorId);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    return await MajorCourseRepository.getByMajor(majorId);
  }

  async delete(majorId: number, courseId: number) {
    const majorCourse = await MajorCourseRepository.get(majorId, courseId);

    if (!majorCourse) {
      throw new NotFoundError('Vínculo entre curso e disciplina');
    }

    return await MajorCourseRepository.delete(majorId, courseId);
  }
}

export default new MajorCourseService();
