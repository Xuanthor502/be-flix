import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IListServices } from '../interfaces/lists.interfaces';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { ResponseMessages } from 'src/utils/user.message';
import { CreateListDto } from '../dtos/create-list.dto';
import { ICurrentUser } from 'src/utils/types';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UpdateListDto } from '../dtos/update-list.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller(Routes.LISTS)
export class ListsController {
  constructor(
    @Inject(Services.LISTS) private readonly listsService: IListServices,
  ) {}
  @Post()
  @ResponseMessage(ResponseMessages.ListMessages.CREATE)
  create(
    @Body() createListDto: CreateListDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.listsService.createList(createListDto, user);
  }
  @Get()
  @Public()
  @ResponseMessage(ResponseMessages.ListMessages.LIST)
  findAll(
    @Query('current') skip: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    const params = {
      skip: isNaN(Number(skip)) ? 0 : Number(skip),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
    };
    return this.listsService.searchLists(params, { query });
  }
  @Get(':id')
  @Public()
  @ResponseMessage(ResponseMessages.ListMessages.FIND_ID)
  findOne(@Param('id') id: string) {
    return this.listsService.findOneList({ _id: id });
  }
  @Patch(':id')
  @ResponseMessage(ResponseMessages.ListMessages.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.listsService.updateList(id, updateListDto, currentUser);
  }
  @Delete(':id')
  @ResponseMessage(ResponseMessages.ListMessages.REMOVE)
  remove(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.listsService.removeList(id, currentUser);
  }
}
