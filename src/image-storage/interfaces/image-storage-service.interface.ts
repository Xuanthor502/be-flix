import { UploadImageParams } from 'src/utils/types';

export interface IImangeUpdaloadService {
  uploadFile(params: UploadImageParams): Promise<string>;
  uploadMultipleFiles(params: {
    files: Express.Multer.File[];
  }): Promise<string[]>;
}
