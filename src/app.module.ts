import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthsModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ImageStorageModule } from './image-storage/image-storage.module';
import { TransformInterceptor } from './utils/interceptors/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/utils/guards/jwt-auth.guard';
import { ThrottlerBehindProxyGuard } from './utils/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { MoviesModule } from './movies/movies.module';
import { FakeDataModule } from './helper/fake-data/fake-data.module';
import { ListsModule } from './lists/lists.module';
let envFilePath = '.env.development';
if (process.env.NODE_ENV === 'production') envFilePath = '.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 20,
        limit: 20,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthsModule,
    RolesModule,
    PermissionsModule,
    ImageStorageModule,
    MoviesModule,
    FakeDataModule,
    ListsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
