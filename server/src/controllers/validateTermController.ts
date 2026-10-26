import type { Request, Response } from 'express';
import { ValidateTermDTO } from '../dto/validateTermDTO.js';
import  ValidateTermService  from '../services/validateTermService.js';

export class ValidateTermController {
  async validateTerm(req: Request, res: Response) {
    const data = ValidateTermDTO.parse(req.body)
    const validateTerm = await ValidateTermService.validateTerm(data)

    return res.status(200).json(validateTerm)
  }
}

export default new ValidateTermController()
