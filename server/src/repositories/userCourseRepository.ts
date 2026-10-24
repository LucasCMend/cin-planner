import { prisma } from './prismaClient.js';
import { CreateUserCourseInput, UpdateUserCourseInput } from '../dto/userCourseDTO.js';

export class UserCourseRepository {
  async create(data: CreateUserCourseInput) {
    return await prisma.userCourse.create({ data });
  }

  async update(userId: number, courseId: number, data: UpdateUserCourseInput) {
    return await prisma.userCourse.update({ where: { userId_courseId: { userId, courseId } }, data });
  }

  async get(userId: number, courseId: number) {
    return await prisma.userCourse.findUnique({ where: { userId_courseId: { userId, courseId } } });
  }

  async getAll() {
    return await prisma.userCourse.findMany();
  }

  async getByUser(userId: number) {
    return await prisma.userCourse.findMany({ where: { userId } });
  }

  async delete(userId: number, courseId: number) {
    return await prisma.userCourse.delete({ where: { userId_courseId: { userId, courseId } } });
  }
}

export default new UserCourseRepository();
