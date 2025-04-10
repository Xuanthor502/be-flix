import { Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { IMovieServices } from '../interfaces/movies.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from 'src/utils/schemas/entities/movie.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  CreateResponse,
  FindMovieParams,
  ICurrentUser,
  RemoveResponse,
  SearchOptions,
  SearchParams,
  UpdateResponse,
} from 'src/utils/types';
import { MovieNotFoundException } from '../exceptions/movie-not-found.excetions';
import { MovieAlreadyExistsException } from '../exceptions/movie-already-exists.excetions';
import aqp from 'api-query-params';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { validateObjectId } from 'src/utils/helpers';

@Injectable()
export class MoviesService implements IMovieServices {
  constructor(
    @InjectModel(Movie.name) private movieModel: SoftDeleteModel<MovieDocument>,
  ) {}

  async findOneMovie(params: FindMovieParams): Promise<Movie> {
    const movie = await this.movieModel.findOne(params).exec();
    if (!movie) {
      throw new MovieNotFoundException();
    }
    return movie;
  }

  async checkTitleMovieExits(title: string) {
    const isExist = await this.findOneMovie({ title: title });
    if (isExist) {
      throw new MovieAlreadyExistsException();
    }
  }

  async createMovie(
    createMovieDto: CreateMovieDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse> {
    const { title } = createMovieDto;
    await this.checkTitleMovieExits(title);
    const newMovie = await this.movieModel.create({
      ...createMovieDto,
      createdBy: {
        _id: currentUser._id,
        email: currentUser.email,
      },
    });
    return {
      _id: newMovie._id as unknown as string,
      createdAt: newMovie.createdAt as unknown as string,
    };
  }

  async searchMovies(params?: SearchParams, options?: SearchOptions) {
    const { filter, sort } = aqp(options?.query || '');
    delete filter.current;
    delete filter.pageSize;
    const skip = params?.skip ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (skip - 1) * limit;
    const totalItems = (await this.movieModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.movieModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .lean()
      .exec();
    return {
      meta: {
        current: skip,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse> {
    validateObjectId(id);
    await this.findOneMovie({ _id: id });
    await this.movieModel.updateOne(
      { _id: id },
      {
        ...updateMovieDto,
        updatedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    const result = await this.findOneMovie({ _id: id });
    return {
      _id: result?._id as unknown as string,
      updatedAt: result?.updatedAt as unknown as string,
    };
  }

  async removeMovie(
    id: string,
    currentUser: ICurrentUser,
  ): Promise<RemoveResponse> {
    validateObjectId(id);
    await this.findOneMovie({ _id: id });
    const updateResult = await this.movieModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    if (updateResult.modifiedCount === 0) {
      throw new MovieNotFoundException();
    }
    await this.movieModel.softDelete({ _id: id });
    const result = await this.findOneMovie({ _id: id });
    return {
      _id: result?._id as unknown as string,
      deletedAt: result?.deletedAt as unknown as string,
    };
  }
}
