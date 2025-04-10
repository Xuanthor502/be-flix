import { HttpException, HttpStatus } from '@nestjs/common';

export class UserInvalidQuery extends HttpException {
  constructor() {
    super('Invalid query user', HttpStatus.BAD_REQUEST);
  }
}
