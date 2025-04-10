import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IPermission } from '../interfaces/permissions.interfaces';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { ResponseMessages } from 'src/utils/user.message';
import { ICurrentUser } from 'src/utils/types';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

@Controller(Routes.PERMISSION)
export class PermissionsController {
  constructor(
    @Inject(Services.PERMISSIONS)
    private readonly permissionsService: IPermission,
  ) {}

  @Post()
  @ResponseMessage(ResponseMessages.PermissionMessages.CREATE)
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.permissionsService.createPermission(
      createPermissionDto,
      currentUser,
    );
  }

  @Get()
  @ResponseMessage(ResponseMessages.PermissionMessages.LIST)
  findAll(
    @Query('current') skip: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    const params = {
      skip: isNaN(Number(skip)) ? 0 : Number(skip),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
    };
    return this.permissionsService.searchPermissions(params, { query });
  }

  @Get(':id')
  @ResponseMessage(ResponseMessages.PermissionMessages.FIND_ID)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOnePermissions({ _id: id });
  }

  @Patch(':id')
  @ResponseMessage(ResponseMessages.PermissionMessages.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.permissionsService.updatePermission(
      id,
      updatePermissionDto,
      currentUser,
    );
  }

  @Delete(':id')
  @ResponseMessage(ResponseMessages.PermissionMessages.REMOVE)
  remove(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.permissionsService.removePermission(id, currentUser);
  }
}
