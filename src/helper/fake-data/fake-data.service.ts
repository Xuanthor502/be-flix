import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, Role, User } from 'src/utils/schemas';
import { PermissionDocument } from 'src/utils/schemas/entities/permission.entity';
import { RoleDocument } from 'src/utils/schemas/entities/role.entity';
import { UserDocument } from 'src/utils/schemas/entities/user.entity';
import { hashPassword } from 'src/utils/helpers';
import { RolesUser } from 'src/utils/constants';
import { DATA_PERMISSIONS } from '../config/dataPermissions';

@Injectable()
export class FakeDataService {
  private readonly logger = new Logger(FakeDataService.name);

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldInitialize = this.configService.get<string>('SHOULD_INIT');
    if (!shouldInitialize) return;
    const [userCount, permissionCount, roleCount] = await Promise.all([
      this.userModel.countDocuments(),
      this.permissionModel.countDocuments(),
      this.roleModel.countDocuments(),
    ]);
    if (permissionCount === 0) {
      await this.permissionModel.insertMany(DATA_PERMISSIONS);
    }
    if (roleCount === 0) {
      const permissions = await this.permissionModel.find().select('_id');
      await this.roleModel.insertMany([
        {
          name: RolesUser.ADMIN,
          description: 'Administrator with full access',
          isActive: true,
          permissions,
        },
        {
          name: RolesUser.USER,
          description: 'Regular user/candidate',
          isActive: true,
          permissions: [],
        },
      ]);
    }
    if (userCount === 0) {
      const [adminRole, userRole] = await Promise.all([
        this.roleModel.findOne({ name: RolesUser.ADMIN }),
        this.roleModel.findOne({ name: RolesUser.USER }),
      ]);
      await this.userModel.insertMany([
        {
          name: 'Admin User',
          email: 'admin@gmail.com',
          password: await hashPassword(
            this.configService.get<string>('PASSWORD') ?? '',
          ),
          age: 69,
          gender: 'MALE',
          address: 'Vietnam',
          role: adminRole?._id,
        },
        {
          name: 'System User',
          email: 'emlamixthor@gmail.com',
          password: await hashPassword(
            this.configService.get<string>('PASSWORD') ?? '',
          ),
          age: 96,
          gender: 'MALE',
          address: 'Vietnam',
          role: adminRole?._id,
        },
        {
          name: 'Regular User',
          email: 'user@gmail.com',
          password: await hashPassword(
            this.configService.get<string>('PASSWORD') ?? '',
          ),
          age: 69,
          gender: 'MALE',
          address: 'Vietnam',
          role: userRole?._id,
        },
      ]);
    }

    if (userCount > 0 && roleCount > 0 && permissionCount > 0) {
      this.logger.log('>>> Sample data already initialized.');
    }
  }
}
