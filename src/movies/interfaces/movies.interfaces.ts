import {
  CreateResponse,
  FindMovieParams,
  ICurrentUser,
  Paginate,
  RemoveResponse,
  SearchOptions,
  SearchParams,
  UpdateResponse,
} from 'src/utils/types';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { Movie } from 'src/utils/schemas';

export interface IMovieServices {
  findOneMovie(params: FindMovieParams): Promise<Movie>;
  checkTitleMovieExits(title: string);
  createMovie(
    createMovieData: CreateMovieDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse>;
  searchMovies(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<Movie[]>>;
  updateMovie(
    id: string,
    updateMovieData: UpdateMovieDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse>;
  removeMovie(id: string, currentUser: ICurrentUser): Promise<RemoveResponse>;
}
