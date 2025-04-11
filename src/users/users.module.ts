import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/utils/schemas';
import { UserSchema } from 'src/utils/schemas/entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    RolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
