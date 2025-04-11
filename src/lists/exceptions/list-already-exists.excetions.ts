import { HttpException, HttpStatus } from '@nestjs/common';

export class ListAlreadyExistsException extends HttpException {
  constructor() {
    super('Title list already exists', HttpStatus.BAD_REQUEST);
  }
}
