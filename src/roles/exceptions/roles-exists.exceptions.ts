import { HttpException, HttpStatus } from '@nestjs/common';

export class RolesAlreadyExists extends HttpException {
  constructor(name: string) {
    super(`Role with name="${name}" already exists!`, HttpStatus.CONFLICT);
  }
}
