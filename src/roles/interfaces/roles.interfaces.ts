import { Role } from 'src/utils/schemas';
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
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

export interface IRoleServices {
  findOneRole(params: FindRoleParams): Promise<Role>;
  checkNameRoleExits(name: string);
  createRole(
    createRoleData: CreateRoleDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse>;
  searchRoles(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<Role[]>>;
  updateRole(
    id: string,
    updateRoleData: UpdateRoleDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse>;
  removeRole(id: string, currentUser: ICurrentUser): Promise<RemoveResponse>;
}
