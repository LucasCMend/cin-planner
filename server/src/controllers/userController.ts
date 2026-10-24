import type { Request, Response } from 'express';
import UserService from '../services/userService.js';
import { CreateUserDTO, UpdateUserDTO } from '../dto/userDTO.js';

export class UserController {
  async create(req: Request, res: Response) {
    const data = CreateUserDTO.parse(req.body);
    const user = await UserService.create(data);

    return res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = UpdateUserDTO.parse(req.body);
    const user = await UserService.update(id, data);

    return res.status(200).json(user);
  }

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await UserService.get(id);

    return res.status(200).json(user);
  }

  async getAll(req: Request, res: Response) {
    const users = await UserService.getAll();

    return res.status(200).json(users);
  }

  async getByEmail(req: Request, res: Response) {
    const email = String(req.params.email);
    const user = await UserService.getByEmail(email);

    return res.status(200).json(user);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await UserService.delete(id);

    return res.status(204).send();
  }
}

export default new UserController();
