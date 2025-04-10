import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionAlreadyExists extends HttpException {
  constructor(apiPath: string, method: string) {
    super(
      `Permission với apiPath=${apiPath} , method=${method} đã tồn tại!`,
      HttpStatus.CONFLICT,
    );
  }
}
