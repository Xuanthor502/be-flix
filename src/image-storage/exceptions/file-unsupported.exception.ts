import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsuppertedFile extends HttpException {
  constructor(name: string) {
    super(`Unsupported file type ${name})}`, HttpStatus.BAD_REQUEST);
  }
}
