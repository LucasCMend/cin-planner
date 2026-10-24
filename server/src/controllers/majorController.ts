import type { Request, Response } from 'express';
import MajorService from '../services/majorService.js';
import { CreateMajorDTO, UpdateMajorDTO } from '../dto/majorDTO.js';

export class MajorController {
  async create(req: Request, res: Response) {
    const data = CreateMajorDTO.parse(req.body);
    const major = await MajorService.create(data);

    return res.status(201).json(major);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = UpdateMajorDTO.parse(req.body);
    const major = await MajorService.update(id, data);

    return res.status(200).json(major);
  }

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    const major = await MajorService.get(id);

    return res.status(200).json(major);
  }

  async getAll(req: Request, res: Response) {
    const majors = await MajorService.getAll();

    return res.status(200).json(majors);
  }

  async getByCode(req: Request, res: Response) {
    const code = String(req.params.code);
    const major = await MajorService.getByCode(code);

    return res.status(200).json(major);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MajorService.delete(id);

    return res.status(204).send();
  }
}

export default new MajorController();
