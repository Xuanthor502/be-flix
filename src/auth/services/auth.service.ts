import { Inject, Injectable } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateUUIDV4 } from 'src/utils/helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { IUserService } from 'src/users/interfaces/users.interfaces';
import { CreateResponse, ICurrentUser } from 'src/utils/types';
import { IRoleServices } from 'src/roles/interfaces/roles.interfaces';
import ms from 'ms';
import { IAuthsService } from '../interfaces/auth.interface';
import { InvalidCredentials } from '../exceptions/invalid-credentials.exceptions';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { InvalidToken } from '../exceptions/invalid-token.exceptions';

@Injectable()
export class AuthsService implements IAuthsService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.ROLES) private readonly roleService: IRoleServices,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getRolePermissions(role: any) {
    if (!role) return [];
    const temp = await this.roleService.findOneRole({ _id: role });
    return temp?.permissions ?? [];
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(
      { email: username },
      { selectAll: true },
    );
    if (!user) throw new InvalidCredentials();
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) return null;
    const permissions = await this.getRolePermissions(user.role);
    const updateDataUser = {
      ...user.toObject(),
      permissions: permissions,
    };
    return updateDataUser;
  }

  async generateRefreshToken(payload: any): Promise<string> {
    const reusult = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      expiresIn: ms(this.configService.get<number>('JWT_REFRESH_EXPIRE_TIME')),
    });
    return reusult;
  }

  async login(user: ICurrentUser, res: Response): Promise<any> {
    const { _id, name, email, role, permissions } = user;
    const payload = {
      sub: 'Token login!',
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      jti: generateUUIDV4(),
      _id,
      name,
      email,
      role,
    };

    const token = await this.generateRefreshToken(payload);
    await this.userService.findAndUpdateUser({ _id }, { refreshToken: token });
    res.cookie('refresh_token', token, {
      maxAge: ms(this.configService.get<number>('JWT_REFRESH_EXPIRE_TIME')),
      httpOnly: true,
    });

    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    };
  }

  async logout(user: ICurrentUser, res: Response): Promise<any> {
    const { _id } = user;
    const token = null;
    await this.userService.findAndUpdateUser(
      { _id: _id as unknown as string },
      { refreshToken: token as unknown as string },
    );
    res.clearCookie('refresh_token', {
      httpOnly: true,
    });
    return 'Success!';
  }

  async register(user: RegisterUserDto): Promise<CreateResponse> {
    let newUser = await this.userService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      });

      const user = await this.userService.findUser({
        refreshToken: refreshToken,
      });
      if (!user) {
        throw new InvalidToken();
      }
      const { _id, name, email, role } = user;
      const payload = {
        iss: 'Job Project',
        sub: 'Token login!',
        aud: 'ongnau.api.click',
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        jti: generateUUIDV4(),
        _id,
        name,
        email,
        role,
      };

      const newRefreshToken = await this.generateRefreshToken(payload);
      await this.userService.findAndUpdateUser(
        { _id: _id as unknown as string },
        { refreshToken: newRefreshToken },
      );

      res.clearCookie('refresh_token', {
        httpOnly: true,
      });
      res.cookie('refresh_token', refreshToken, {
        maxAge: ms(this.configService.get<number>('JWT_REFRESH_EXPIRE_TIME')),
        httpOnly: true,
      });
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } catch (error) {
      throw new InvalidToken();
    }
  }
}
