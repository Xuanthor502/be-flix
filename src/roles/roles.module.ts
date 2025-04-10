import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/utils/schemas/entities/role.entity';
import { Services } from 'src/utils/constants';
import { RolesService } from './services/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [
    {
      provide: Services.ROLES,
      useClass: RolesService,
    },
  ],
  exports: [
    {
      provide: Services.ROLES,
      useClass: RolesService,
    },
  ],
})
export class RolesModule {}
