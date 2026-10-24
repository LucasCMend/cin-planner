import { prisma } from './prismaClient.js';
import { CreateUserInput, UpdateUserInput } from '../dto/userDTO.js';

export class UserRepository {
  async create(data: CreateUserInput) {
    return await prisma.user.create({ data });
  }

  async update(id: number, data: UpdateUserInput) {
    return await prisma.user.update({ where: { id }, data });
  }

  async get(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getAll() {
    return await prisma.user.findMany();
  }

  async getByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  }
}

export default new UserRepository();
