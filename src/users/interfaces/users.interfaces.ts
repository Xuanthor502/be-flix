
import { RegisterUserDto } from 'src/auth/dtos/register-user.dto';
import { User } from 'src/utils/schemas';
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

export interface IUserService {
  checkEmailExist(param: any);
  createUser(
    createUserData: CreateUserDetails,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse>;
  register(registerUserData: RegisterUserDto): Promise<CreateResponse>;
  findUser(params: FindUserParams, options?: FindUserOptions): Promise<any>;
  findAndUpdateUser(
    params: FindUserParams,
    updateData: Partial<User>,
  ): Promise<User>;
  findAndRemoveUser(id: string, user: ICurrentUser): Promise<any>;
  searchUsers(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<User[]>>;
}

