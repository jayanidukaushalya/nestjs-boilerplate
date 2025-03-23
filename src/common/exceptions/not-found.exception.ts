import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class NotFoundError extends Error {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message);
    this.name = 'NotFoundError';
  }
}
