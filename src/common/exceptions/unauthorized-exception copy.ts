import { ERROR_MESSAGES } from '../constants/error-messages';

export class UnauthorizedError extends Error {
  constructor() {
    super(ERROR_MESSAGES.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}
