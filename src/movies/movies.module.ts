import { Module } from '@nestjs/common';
import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie } from 'src/utils/schemas';
import { Services } from 'src/utils/constants';
import { MovieSchema } from 'src/utils/schemas/entities/movie.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [
    {
      provide: Services.MOVIES,
      useClass: MoviesService,
    },
  ],
  exports: [
    {
      provide: Services.MOVIES,
      useClass: MoviesService,
    },
  ],
})
export class MoviesModule {}
