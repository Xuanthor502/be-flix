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
import { IMovieServices } from '../interfaces/movies.interfaces';
import { ResponseMessages } from 'src/utils/user.message';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { ICurrentUser } from 'src/utils/types';
import { UpdateMovieDto } from '../dtos/update-movie.dto';

@Controller(Routes.MOVIES)
export class MoviesController {
  constructor(
    @Inject(Services.MOVIES) private readonly moviesService: IMovieServices,
  ) {}

  @Post()
  @ResponseMessage(ResponseMessages.MovieMessages.CREATE)
  create(
    @Body() createMovieDto: CreateMovieDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.moviesService.createMovie(createMovieDto, user);
  }

  @Get()
  @ResponseMessage(ResponseMessages.MovieMessages.LIST)
  findAll(
    @Query('current') skip: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    const params = {
      skip: isNaN(Number(skip)) ? 0 : Number(skip),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
    };
    return this.moviesService.searchMovies(params, { query });
  }

  @Get(':id')
  @ResponseMessage(ResponseMessages.MovieMessages.FIND_ID)
  findOne(@Param('id') id: string) {
    return this.moviesService.findOneMovie({ _id: id });
  }

  @Patch(':id')
  @ResponseMessage(ResponseMessages.MovieMessages.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.moviesService.updateMovie(id, updateMovieDto, currentUser);
  }

  @Delete(':id')
  @ResponseMessage(ResponseMessages.MovieMessages.REMOVE)
  remove(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.moviesService.removeMovie(id, currentUser);
  }
}
