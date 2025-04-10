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
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { Permission } from 'src/utils/schemas';

export interface IPermission {
  checkPermissionExits(apiPath: string, method: string);
  createPermission(
    permisison: CreatePermissionDto,
    user: ICurrentUser,
  ): Promise<CreateResponse>;
  findOnePermissions(params: FindPermissionParams): Promise<Permission>;
  searchPermissions(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<Permission[]>>;
  updatePermission(
    id: string,
    updateData: Partial<Permission>,
    user: ICurrentUser,
  ): Promise<UpdateResponse>;
  removePermission(id: string, user: ICurrentUser): Promise<RemoveResponse>;
}

