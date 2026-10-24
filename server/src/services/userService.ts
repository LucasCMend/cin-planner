import { CreateUserInput, UpdateUserInput } from '../dto/userDTO.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import MajorRepository from '../repositories/majorRepository.js';
import UserRepository from '../repositories/userRepository.js';

export class UserService {
  async create(data: CreateUserInput) {
    const major = await MajorRepository.get(data.majorId);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    const existing = await UserRepository.getByEmail(data.email);

    if (existing) {
      throw new ConflictError('Já existe um usuário com esse e-mail');
    }

    return await UserRepository.create(data);
  }

  async update(id: number, data: UpdateUserInput) {
    const user = await UserRepository.get(id);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError();
    }

    if (data.majorId !== undefined) {
      const major = await MajorRepository.get(data.majorId);

      if (!major) {
        throw new NotFoundError('Curso');
      }
    }

    return await UserRepository.update(id, data);
  }

  async get(id: number) {
    const user = await UserRepository.get(id);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    return user;
  }

  async getAll() {
    return await UserRepository.getAll();
  }

  async getByEmail(email: string) {
    const user = await UserRepository.getByEmail(email);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    return user;
  }

  async delete(id: number) {
    const user = await UserRepository.get(id);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    return await UserRepository.delete(id);
  }
}

export default new UserService();
