import { prisma } from './prismaClient.js';
import { CreateCoursePrerequisiteInput } from '../dto/coursePrerequisiteDTO.js';

export class CoursePrerequisiteRepository {
  async create(data: CreateCoursePrerequisiteInput) {
    return await prisma.coursePrerequisite.create({ data });
  }

  async get(courseId: number, requiredCourseId: number) {
    return await prisma.coursePrerequisite.findUnique({
      where: { courseId_requiredCourseId: { courseId, requiredCourseId } }
    });
  }

  async getAll() {
    return await prisma.coursePrerequisite.findMany();
  }

  async getByCourse(courseId: number) {
    return await prisma.coursePrerequisite.findMany({ where: { courseId } });
  }

  async getRequiredCodesByCourse(courseId: number): Promise<string[]> {
    const edges = await prisma.coursePrerequisite.findMany({
      where: { courseId },
      select: { requiredCourse: { select: { code: true } } }
    });
    return edges.map((edge) => edge.requiredCourse.code);
  }

  async delete(courseId: number, requiredCourseId: number) {
    return await prisma.coursePrerequisite.delete({
      where: { courseId_requiredCourseId: { courseId, requiredCourseId } }
    });
  }
}

export default new CoursePrerequisiteRepository();
