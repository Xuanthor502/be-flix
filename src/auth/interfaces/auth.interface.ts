import { Response } from 'express';
import { CreateResponse, ICurrentUser } from 'src/utils/types';
import { RegisterUserDto } from '../dtos/register-user.dto';
export interface IAuthsService {
  validateUser(username: string, pass: string): Promise<any>;
  login(user: ICurrentUser, res: Response): Promise<any>;
  logout(user: ICurrentUser, res: Response): Promise<any>;
  generateRefreshToken(payload: any): Promise<any>;
  refreshAccessToken(
    refreshToken: string,
    res: Response,
  ): Promise<{ access_token: string }>;
  getRolePermissions(role: any);
  register(registerUserData: RegisterUserDto): Promise<CreateResponse>;
}
