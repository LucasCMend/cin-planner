import { prisma } from './prismaClient.js';
import { CreateCourseInput, UpdateCourseInput } from '../dto/courseDTO.js';

export class CourseRepository {
  async create(data: CreateCourseInput) {
    return await prisma.course.create({ data });
  }

  async update(id: number, data: UpdateCourseInput) {
    return await prisma.course.update({ where: { id }, data });
  }

  async get(id: number) {
    return await prisma.course.findUnique({ where: { id } });
  }

  async getAll() {
    return await prisma.course.findMany();
  }

  async getByCode(code: string) {
    return await prisma.course.findUnique({ where: { code } });
  }

  async delete(id: number) {
    return await prisma.course.delete({ where: { id } });
  }
}

export default new CourseRepository();
