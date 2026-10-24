import { CreateMajorInput, UpdateMajorInput } from '../dto/majorDTO.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import MajorRepository from '../repositories/majorRepository.js';

export class MajorService {
  async create(data: CreateMajorInput) {
    const existing = await MajorRepository.getByCode(data.code);

    if (existing) {
      throw new ConflictError('Já existe um curso com esse código');
    }

    return await MajorRepository.create(data);
  }

  async update(id: number, data: UpdateMajorInput) {
    const major = await MajorRepository.get(id);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError();
    }

    return await MajorRepository.update(id, data);
  }

  async get(id: number) {
    const major = await MajorRepository.get(id);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    return major;
  }

  async getAll() {
    return await MajorRepository.getAll();
  }

  async getByCode(code: string) {
    const major = await MajorRepository.getByCode(code);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    return major;
  }

  async delete(id: number) {
    const major = await MajorRepository.get(id);

    if (!major) {
      throw new NotFoundError('Curso');
    }

    return await MajorRepository.delete(id);
  }
}

export default new MajorService();
