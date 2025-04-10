import { Module } from '@nestjs/common';
import { ImageStorageService } from './image-storage.service';
import { Services } from 'src/utils/constants';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './utils/multer.config';
import { ImageStorageController } from './image-storage.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [ImageStorageController],
  providers: [
    {
      provide: Services.IMAGE_UPLOAD,
      useClass: ImageStorageService,
    },
  ],
  exports: [
    {
      provide: Services.IMAGE_UPLOAD,
      useClass: ImageStorageService,
    },
  ],
})
export class ImageStorageModule {}
