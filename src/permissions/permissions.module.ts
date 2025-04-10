import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission } from 'src/utils/schemas';
import { PermissionSchema } from 'src/utils/schemas/entities/permission.entity';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [
    {
      provide: Services.PERMISSIONS,
      useClass: PermissionsService,
    },
  ],
  exports: [
    {
      provide: Services.PERMISSIONS,
      useClass: PermissionsService,
    },
  ],
})
export class PermissionsModule {}

