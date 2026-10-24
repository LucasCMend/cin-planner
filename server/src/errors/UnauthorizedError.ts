import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'Autenticação necessária', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}
