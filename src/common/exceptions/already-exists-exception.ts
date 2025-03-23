import { ERROR_MESSAGES } from '../constants/error-messages';

export class AlreadyExistsError extends Error {
  constructor(message: string = ERROR_MESSAGES.ALREADY_EXISTS) {
    super(message);
    this.name = 'AlreadyExistsError';
  }
}
