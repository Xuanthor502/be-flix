import { Injectable } from '@nestjs/common';
import { IImangeUpdaloadService } from './interfaces/image-storage-service.interface';
import { UploadImageParams } from 'src/utils/types';

@Injectable()
export class ImageStorageService implements IImangeUpdaloadService {
  async uploadFile(params: UploadImageParams): Promise<string> {
    return params.file.filename;
  }
}
