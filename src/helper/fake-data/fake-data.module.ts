import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, Role, User } from 'src/utils/schemas';
import { RoleSchema } from 'src/utils/schemas/entities/role.entity';
import { PermissionSchema } from 'src/utils/schemas/entities/permission.entity';
import { UserSchema } from 'src/utils/schemas/entities/user.entity';
import { FakeDataService } from './fake-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [FakeDataService],
})
export class FakeDataModule {}
