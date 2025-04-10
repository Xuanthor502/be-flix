import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import ms from 'ms';
import { RolesModule } from 'src/roles/roles.module';
import { AuthsController } from './controllers/auth.controller';
import { LocalStrategy } from './utils/strategies/local.strategy';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { AuthsService } from './services/auth.service';


@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
        signOptions: {
          expiresIn:
            ms(configService.get<number>('JWT_ACCESS_EXPIRE_TIME')) / 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthsController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    {
      provide: Services.AUTHS,
      useClass: AuthsService,
    },
  ],
  exports: [
    PassportModule,
    JwtModule,
    {
      provide: Services.AUTHS,
      useClass: AuthsService,
    },
  ],
})
export class AuthsModule {}
