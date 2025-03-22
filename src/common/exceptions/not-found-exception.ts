import { ERROR_MESSAGES } from '../constants/error-messages';

export class NotFoundError extends Error {
  constructor() {
    super(ERROR_MESSAGES.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
