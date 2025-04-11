import {
  Controller,
  Post,
  UseInterceptors,
  UseFilters,
  UploadedFile,
  Inject,
  UploadedFiles,
} from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './exceptions/http-filter-file.exception';
import { IImangeUpdaloadService } from './interfaces/image-storage-service.interface';
import { Routes, Services } from 'src/utils/constants';
import { ResponseMessages } from 'src/utils/user.message';

@Controller(Routes.IMAGE_UPLOAD)
export class ImageStorageController {
  constructor(
    @Inject(Services.IMAGE_UPLOAD)
    private readonly imageStorageService: IImangeUpdaloadService,
  ) {}

  @Post('upload')
  @Public()
  @ResponseMessage(ResponseMessages.FileMessages.UPLOAD_SINGLE)
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(new HttpExceptionFilter())
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const params = { file };
    return this.imageStorageService.uploadFile(params);
  }

  @Post('upload-multiple')
  @Public()
  @ResponseMessage(ResponseMessages.FileMessages.UPLOAD_MULTIPLE )
  @UseInterceptors(FilesInterceptor('files'))
  @UseFilters(new HttpExceptionFilter())
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.imageStorageService.uploadMultipleFiles({ files });
  }
}
