import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
export class CreateMovieDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
  @Optional()
  desc?: string;
  @Optional()
  img?: string;
  @Optional()
  imgTitle?: string;
  @Optional()
  imgSm?: string;
  @Optional()
  trailer?: string;
  @Optional()
  video?: string;
  @Optional()
  year?: string;
  @Optional()
  limit?: number;
  @Optional()
  genrce?: string;
}
