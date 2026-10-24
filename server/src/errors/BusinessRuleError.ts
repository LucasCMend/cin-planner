import { AppError } from './AppError.js';

// Requisição válida e bem formada, mas que viola uma regra de negócio
// (ex.: ciclo no grafo de pré-requisitos).
export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, 'BUSINESS_RULE_VIOLATION', details);
  }
}
