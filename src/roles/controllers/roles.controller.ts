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
import { IRoleServices } from '../interfaces/roles.interfaces';
import { Routes, Services } from 'src/utils/constants';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { ResponseMessages } from 'src/utils/user.message';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { ICurrentUser } from 'src/utils/types';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@Controller(Routes.ROLES)
export class RolesController {
  constructor(
    @Inject(Services.ROLES) private readonly rolesService: IRoleServices,
  ) {}

  @Post()
  @ResponseMessage(ResponseMessages.RoleMessages.CREATE)
  create(
    @Body() createRoleData: CreateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.rolesService.createRole(createRoleData, user);
  }

  @Get()
  @ResponseMessage(ResponseMessages.RoleMessages.LIST)
  findAll(
    @Query('current') skip: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    const params = {
      skip: isNaN(Number(skip)) ? 0 : Number(skip),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
    };
    return this.rolesService.searchRoles(params, { query });
  }

  @Get(':id')
  @ResponseMessage(ResponseMessages.RoleMessages.FIND_ID)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneRole({ _id: id });
  }

  @Patch(':id')
  @ResponseMessage(ResponseMessages.RoleMessages.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.rolesService.updateRole(id, updateRoleDto, currentUser);
  }

  @Delete(':id')
  @ResponseMessage('Delete a role')
  remove(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.rolesService.removeRole(id, currentUser);
  }
}
