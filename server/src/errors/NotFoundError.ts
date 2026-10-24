import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso', details?: unknown) {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND', details);
  }
}
