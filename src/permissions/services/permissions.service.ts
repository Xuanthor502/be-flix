import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import {
  CreateResponse,
  FindPermissionParams,
  ICurrentUser,
  Paginate,
  RemoveResponse,
  SearchOptions,
  SearchParams,
  UpdateResponse,
} from 'src/utils/types';
import { Permission } from 'src/utils/schemas';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { PermissionDocument } from 'src/utils/schemas/entities/permission.entity';
import { IPermission } from '../interfaces/permissions.interfaces';
import { PermissionAlreadyExists } from '../exceptions/permission-exists.exception';
import { PermissionNotFoundException } from '../exceptions/permission-not-found.exception';

@Injectable()
export class PermissionsService implements IPermission {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async checkPermissionExits(apiPath: string, method: string) {
    const isExist = await this.permissionModel.findOne({
      apiPath,
      method,
    });
    if (isExist) {
      throw new PermissionAlreadyExists(apiPath, method);
    }
  }

  async createPermission(
    createPermissionData: CreatePermissionDto,
    user: ICurrentUser,
  ): Promise<CreateResponse> {
    const { apiPath, method } = createPermissionData;
    await this.checkPermissionExits(apiPath, method);
    const newPermission = await this.permissionModel.create({
      ...createPermissionData,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermission?._id as unknown as string,
      createdAt: newPermission?.createdAt as unknown as string,
    };
  }

  async searchPermissions(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<Permission[]>> {
    const { filter, sort } = aqp(options?.query || '');
    delete filter.current;
    delete filter.pageSize;
    const skip = params?.skip ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (skip - 1) * limit;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.permissionModel
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

  async findOnePermissions(params: FindPermissionParams): Promise<Permission> {
    const result = await this.permissionModel.findOne(params).exec();
    if (!result) {
      throw new PermissionNotFoundException();
    }
    return result;
  }

  async updatePermission(
    id: string,
    updateData: Partial<Permission>,
    user: ICurrentUser,
  ): Promise<UpdateResponse> {
    const existingPermission = await this.permissionModel.findById(id);
    if (!existingPermission) {
      throw new PermissionNotFoundException();
    }
    existingPermission.set({
      ...updateData,
      updatedBy: { _id: user._id, email: user.email },
    });
    await existingPermission.save();
    return {
      _id: existingPermission._id as unknown as string,
      updatedAt: existingPermission.updatedAt as unknown as string,
    };
  }

  async removePermission(
    id: string,
    user: ICurrentUser,
  ): Promise<RemoveResponse> {
    const updateResult = await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    if (updateResult.modifiedCount === 0) {
      throw new PermissionNotFoundException();
    }
    await this.permissionModel.softDelete({
      _id: id,
    });
    const result = await this.findOnePermissions({ _id: id });
    return {
      _id: result?._id as unknown as string,
      deletedAt: result?.deletedAt as unknown as string,
    };
  }
}
