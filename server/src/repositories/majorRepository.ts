import { prisma } from './prismaClient.js';
import { CreateMajorInput, UpdateMajorInput } from '../dto/majorDTO.js';

export class MajorRepository {
  async create(data: CreateMajorInput) {
    return await prisma.major.create({ data });
  }

  async update(id: number, data: UpdateMajorInput) {
    return await prisma.major.update({ where: { id }, data });
  }

  async get(id: number) {
    return await prisma.major.findUnique({ where: { id } });
  }

  async getAll() {
    return await prisma.major.findMany();
  }

  async getByCode(code: string) {
    return await prisma.major.findUnique({ where: { code } });
  }

  async delete(id: number) {
    return await prisma.major.delete({ where: { id } });
  }
}

export default new MajorRepository();
