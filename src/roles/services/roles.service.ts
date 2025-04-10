import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import {
  CreateResponse,
  FindRoleParams,
  ICurrentUser,
  Paginate,
  RemoveResponse,
  SearchOptions,
  SearchParams,
  UpdateResponse,
} from 'src/utils/types';
import { validateObjectId } from 'src/utils/helpers';
import { Role } from 'src/utils/schemas';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleDocument } from 'src/utils/schemas/entities/role.entity';
import { IRoleServices } from '../interfaces/roles.interfaces';
import { RolesNotFoundException } from '../exceptions/roles-not-found.exception';
import { RolesAlreadyExists } from '../exceptions/roles-exists.exceptions';

@Injectable()
export class RolesService implements IRoleServices {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async findOneRole(params: FindRoleParams): Promise<Role> {
    const result = await this.roleModel
      .findOne(params)
      .populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
      })
      .exec();
    if (!result) {
      throw new RolesNotFoundException();
    }
    return result;
  }

  async checkNameRoleExits(name: string) {
    const isExist = await this.findOneRole({ name: name });
    if (isExist) {
      throw new RolesAlreadyExists(name);
    }
  }

  async createRole(
    createRoleData: CreateRoleDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse> {
    const { name } = createRoleData;
    await this.checkNameRoleExits(name);
    const newRole = await this.roleModel.create({
      ...createRoleData,
      createdBy: {
        _id: currentUser._id,
        email: currentUser.email,
      },
    });
    return {
      _id: newRole?._id as unknown as string,
      createdAt: newRole?.createdAt as unknown as string,
    };
  }

  async searchRoles(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<Role[]>> {
    const { filter, sort } = aqp(options?.query || '');
    delete filter.current;
    delete filter.pageSize;
    const skip = params?.skip ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (skip - 1) * limit;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort((sort as any) || { createdAt: -1 })
      .lean()
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

  async updateRole(
    id: string,
    updateRoleData: UpdateRoleDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse> {
    validateObjectId(id);
    await this.findOneRole({ _id: id });
    await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleData,
        updatedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    const result = await this.findOneRole({ _id: id });
    return {
      _id: result?._id as unknown as string,
      updatedAt: result?.updatedAt as unknown as string,
    };
  }

  async removeRole(
    id: string,
    currentUser: ICurrentUser,
  ): Promise<RemoveResponse> {
    validateObjectId(id);
    const updateResult = await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    if (updateResult.modifiedCount === 0) {
      throw new RolesNotFoundException();
    }
    await this.roleModel.softDelete({
      _id: id,
    });
    const result = await this.findOneRole({ _id: id });
    return {
      _id: result?._id as unknown as string,
      deletedAt: result?.deletedAt as unknown as string,
    };
  }
}

