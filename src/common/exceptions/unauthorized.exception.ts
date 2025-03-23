import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class UnauthorizedError extends Error {
  constructor(error: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(error);
    this.name = 'UnauthorizedError';
  }
}
