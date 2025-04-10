import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { UnsuppertedFile } from '../exceptions/file-unsupported.exception';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly uploadRoot = path.join(process.cwd(), 'public', 'images');

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = Array.isArray(req.headers?.folder_type)
            ? req.headers.folder_type[0]
            : req.headers?.folder_type || 'default';
          const uploadPath = path.join(this.uploadRoot, folder);
          this.ensureDirectoryExists(uploadPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          const uniqueName = `${name}-${Date.now()}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'pdf',
          'doc',
          'docx',
        ];
        const ext = path.extname(file.originalname).slice(1).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
          return cb(new UnsuppertedFile(ext), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 1 * 1024 * 1024 },
    };
  }
}
