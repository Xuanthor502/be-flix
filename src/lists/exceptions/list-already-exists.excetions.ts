import { HttpException, HttpStatus } from '@nestjs/common';

export class ListAlreadyExistsException extends HttpException {
  constructor() {
    super('List already exists', HttpStatus.BAD_REQUEST);
  }
}
