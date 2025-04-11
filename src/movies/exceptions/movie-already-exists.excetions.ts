import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieAlreadyExistsException extends HttpException {
  constructor() {
    super('Title movie already exists', HttpStatus.BAD_REQUEST);
  }
}
