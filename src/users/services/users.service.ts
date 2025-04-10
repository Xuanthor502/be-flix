import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { hashPassword } from 'src/utils/helpers';
import {
  CreateUserDetails,
  ICurrentUser,
  FindUserOptions,
  FindUserParams,
  Paginate,
  SearchOptions,
  SearchParams,
  CreateResponse,
} from 'src/utils/types';
import aqp from 'api-query-params';
import { User, UserDocument } from 'src/utils/schemas/entities/user.entity';
import { RolesUser, Services } from 'src/utils/constants';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { IUserService } from '../interfaces/users.interfaces';
import { IRoleServices } from 'src/roles/interfaces/roles.interfaces';
import { EmailAlreadyExists } from '../exceptions/email-already-exists.excetions';
import { RegisterUserDto } from 'src/auth/dtos/register-user.dto';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @Inject(Services.ROLES) private roleService: IRoleServices,
  ) {}

  async checkEmailExist(params: any) {
    const existsEmail = await this.userModel.findOne({ email: params.email });
    if (existsEmail) throw new EmailAlreadyExists();
  }

  async createUser(
    userDetails: CreateUserDetails,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<CreateResponse> {
    const { password, email } = userDetails;
    await this.checkEmailExist(email);
    const hashedPassword = await hashPassword(password);
    const param = {
      ...userDetails,
      email,
      password: hashedPassword,
      createdBy: {
        _id: currentUser._id,
        email: currentUser.email,
      },
    };

    try {
      const result = await this.userModel.create(param);
      return {
        _id: result?._id as unknown as string,
        createdAt: result?.createdAt as unknown as string,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async register(registerUserData: RegisterUserDto): Promise<CreateResponse> {
    const { email, password } = registerUserData;
    await this.checkEmailExist(email);
    const userRole = await this.roleService.findOneRole({
      name: RolesUser.USER,
    });
    const hashedPassword = await hashPassword(password);
    const result = await this.userModel.create({
      ...registerUserData,
      email,
      password: hashedPassword,
      role: userRole?._id,
    });
    return {
      _id: result?._id as unknown as string,
      createdAt: result?.createdAt as unknown as string,
    };
  }

  async findUser(
    params: FindUserParams,
    options?: FindUserOptions,
  ): Promise<any> {
    const selects: (keyof User)[] = ['_id', 'email', 'name', 'role'];
    const selectsWithPassword: (keyof User)[] = [...selects, 'password'];
    const result = await this.userModel
      .findOne(params)
      .select(options?.selectAll ? selectsWithPassword : selects)
      .exec();
    if (!result) throw new UserNotFoundException();
    return result;
  }

  async searchUsers(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<User[]>> {
    const { filter, sort } = aqp(options?.query || '');
    delete filter.current;
    delete filter.pageSize;
    const skip = params?.skip ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (skip - 1) * limit;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(limit)
      .sort((sort as any) || { createdAt: -1 })
      .exec();
    return {
      meta: {
        current: skip,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findAndUpdateUser(
    params: FindUserParams,
    updateData: Partial<User>,
  ): Promise<User> {
    const findUser = await this.userModel.findOne(params);
    if (!findUser) throw new UserNotFoundException();

    Object.assign(findUser, updateData);

    return await findUser.save();
  }

  async findAndRemoveUser(id: string, user: ICurrentUser) {
    const findUser = await this.userModel.findOne({ _id: id });
    if (!findUser) throw new UserNotFoundException();
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({
      _id: id,
    });
  }
}
