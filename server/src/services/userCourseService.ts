import { CreateUserCourseInput, UpdateUserCourseInput } from '../dto/userCourseDTO.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import CourseRepository from '../repositories/courseRepository.js';
import UserCourseRepository from '../repositories/userCourseRepository.js';
import UserRepository from '../repositories/userRepository.js';

export class UserCourseService {
  async create(data: CreateUserCourseInput) {
    const user = await UserRepository.get(data.userId);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    const course = await CourseRepository.get(data.courseId);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    const existing = await UserCourseRepository.get(data.userId, data.courseId);

    if (existing) {
      throw new ConflictError('Disciplina já registrada no histórico do usuário');
    }

    // TODO (regras de negócio): disciplina pertence ao curso do usuário, pré-requisitos, etc.
    return await UserCourseRepository.create(data);
  }

  async update(userId: number, courseId: number, data: UpdateUserCourseInput) {
    const userCourse = await UserCourseRepository.get(userId, courseId);

    if (!userCourse) {
      throw new NotFoundError('Disciplina do histórico');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError();
    }

    return await UserCourseRepository.update(userId, courseId, data);
  }

  async get(userId: number, courseId: number) {
    const userCourse = await UserCourseRepository.get(userId, courseId);

    if (!userCourse) {
      throw new NotFoundError('Disciplina do histórico');
    }

    return userCourse;
  }

  async getAll() {
    return await UserCourseRepository.getAll();
  }

  async getByUser(userId: number) {
    const user = await UserRepository.get(userId);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    return await UserCourseRepository.getByUser(userId);
  }

  async delete(userId: number, courseId: number) {
    const userCourse = await UserCourseRepository.get(userId, courseId);

    if (!userCourse) {
      throw new NotFoundError('Disciplina do histórico');
    }

    return await UserCourseRepository.delete(userId, courseId);
  }
}

export default new UserCourseService();
