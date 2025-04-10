import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IRoleServices } from 'src/roles/interfaces/roles.interfaces';
import { Services } from 'src/utils/constants';
import { ICurrentUser } from 'src/utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Services.ROLES) private readonly rolesService: IRoleServices,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
    });
  }
  private async getRolePermissions(role: any) {
    if (!role) return [];
    const temp = await this.rolesService.findOneRole({ _id: role });
    return temp?.permissions ?? [];
  }

  async validate(payload: ICurrentUser) {
    const { _id, name, email, role } = payload;
    const permissions = await this.getRolePermissions(role);
    return {
      _id,
      name,
      email,
      role,
      permissions,
    };
  }
}

