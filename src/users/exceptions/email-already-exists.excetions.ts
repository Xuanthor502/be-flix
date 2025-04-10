import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExists extends HttpException {
  constructor() {
    super('Email already exists', HttpStatus.CONFLICT);
  }
}
