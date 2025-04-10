import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieAlreadyExistsException extends HttpException {
  constructor() {
    super('Movie already exists', HttpStatus.BAD_REQUEST);
  }
}
