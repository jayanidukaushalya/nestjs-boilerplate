import { ERROR_MESSAGES } from '../constants/error-messages';

export class AlreadyExistsError extends Error {
  constructor() {
    super(ERROR_MESSAGES.ALREADY_EXISTS);
    this.name = 'AlreadyExistsError';
  }
}
