import { HttpException, HttpStatus } from '@nestjs/common';

export class RolesNotFoundException extends HttpException {
  constructor() {
    super('Role not found', HttpStatus.NOT_FOUND);
  }
}
