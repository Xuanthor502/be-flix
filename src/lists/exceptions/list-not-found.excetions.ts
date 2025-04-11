import { HttpException, HttpStatus } from '@nestjs/common';

export class ListNotFoundException extends HttpException {
  constructor() {
    super('List not found', HttpStatus.NOT_FOUND);
  }
}
