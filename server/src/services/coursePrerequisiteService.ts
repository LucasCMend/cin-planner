import { CreateCoursePrerequisiteInput } from '../dto/coursePrerequisiteDTO.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import CoursePrerequisiteRepository from '../repositories/coursePrerequisiteRepository.js';
import CourseRepository from '../repositories/courseRepository.js';

export class CoursePrerequisiteService {
  async create(data: CreateCoursePrerequisiteInput) {
    const course = await CourseRepository.get(data.courseId);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    const requiredCourse = await CourseRepository.get(data.requiredCourseId);

    if (!requiredCourse) {
      throw new NotFoundError('Pré-requisito');
    }

    const existing = await CoursePrerequisiteRepository.get(data.courseId, data.requiredCourseId);

    if (existing) {
      throw new ConflictError('Pré-requisito já cadastrado para essa disciplina');
    }

    // TODO (regras de negócio): auto-referência e validação de ciclo (validatePrerequisiteGraph).
    return await CoursePrerequisiteRepository.create(data);
  }

  async get(courseId: number, requiredCourseId: number) {
    const prerequisite = await CoursePrerequisiteRepository.get(courseId, requiredCourseId);

    if (!prerequisite) {
      throw new NotFoundError('Pré-requisito');
    }

    return prerequisite;
  }

  async getAll() {
    return await CoursePrerequisiteRepository.getAll();
  }

  async getByCourse(courseId: number) {
    const course = await CourseRepository.get(courseId);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    return await CoursePrerequisiteRepository.getByCourse(courseId);
  }

  async delete(courseId: number, requiredCourseId: number) {
    const prerequisite = await CoursePrerequisiteRepository.get(courseId, requiredCourseId);

    if (!prerequisite) {
      throw new NotFoundError('Pré-requisito');
    }

    return await CoursePrerequisiteRepository.delete(courseId, requiredCourseId);
  }
}

export default new CoursePrerequisiteService();
