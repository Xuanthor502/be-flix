import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieNotFoundException extends HttpException {
  constructor() {
    super('Movie not found', HttpStatus.NOT_FOUND);
  }
}
