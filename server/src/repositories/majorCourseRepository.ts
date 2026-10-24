import { prisma } from './prismaClient.js';
import { CreateMajorCourseInput, UpdateMajorCourseInput } from '../dto/majorCourseDTO.js';

export class MajorCourseRepository {
  async create(data: CreateMajorCourseInput) {
    return await prisma.majorCourse.create({ data });
  }

  async update(majorId: number, courseId: number, data: UpdateMajorCourseInput) {
    return await prisma.majorCourse.update({ where: { majorId_courseId: { majorId, courseId } }, data });
  }

  async get(majorId: number, courseId: number) {
    return await prisma.majorCourse.findUnique({ where: { majorId_courseId: { majorId, courseId } } });
  }

  async getAll() {
    return await prisma.majorCourse.findMany();
  }

  async getByMajor(majorId: number) {
    return await prisma.majorCourse.findMany({ where: { majorId } });
  }

  async delete(majorId: number, courseId: number) {
    return await prisma.majorCourse.delete({ where: { majorId_courseId: { majorId, courseId } } });
  }
}

export default new MajorCourseRepository();
