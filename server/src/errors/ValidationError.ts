import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Dados de entrada inválidos', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}
