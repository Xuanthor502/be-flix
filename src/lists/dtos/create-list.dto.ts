import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
  @Optional()
  type?: string;
  @Optional()
  genre?: string;
  @Optional()
  content?: string[];
}
