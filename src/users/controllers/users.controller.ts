import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from '../interfaces/users.interfaces';
import { ResponseMessages } from 'src/utils/user.message';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { Public } from 'src/utils/decorators/public.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { ICurrentUser } from 'src/utils/types';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) readonly userService: IUserService) {}

  @Post()
  @ResponseMessage(ResponseMessages.UserMessages.CREATE)
  async create(
    @Body() createUserParams: CreateUserDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.userService.createUser(createUserParams, user);
  }

  @Get()
  @ResponseMessage(ResponseMessages.UserMessages.LIST)
  searchUsers(
    @Query('current') skip: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    const params = {
      skip: isNaN(Number(skip)) ? 0 : Number(skip),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
    };
    return this.userService.searchUsers(params, { query });
  }

  @Get(':id')
  @Public()
  @ResponseMessage(ResponseMessages.UserMessages.FIND_ID)
  async findOne(@Param('id') id: string) {
    const foundUser = await this.userService.findUser({ _id: id });
    return foundUser;
  }

  @Patch(':id')
  @ResponseMessage(ResponseMessages.UserMessages.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateUserParams: UpdateUserDto,
  ) {
    let updatedUser = await this.userService.findAndUpdateUser(
      { _id: id },
      updateUserParams,
    );
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage(ResponseMessages.UserMessages.REMOVE)
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.userService.findAndRemoveUser(id, user);
  }
}
