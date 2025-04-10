import { UploadImageParams } from 'src/utils/types';

export interface IImangeUpdaloadService {
  uploadFile(params: UploadImageParams): Promise<string>;
}

