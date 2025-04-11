import { Module } from '@nestjs/common';
import { ListsController } from './controllers/lists.controller';
import { ListsService } from './services/lists.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { List } from 'src/utils/schemas';
import { ListSchema } from 'src/utils/schemas/entities/list.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
  ],
  controllers: [ListsController],
  providers: [
    {
      provide: Services.LISTS,
      useClass: ListsService,
    },
  ],
  exports: [
    {
      provide: Services.LISTS,
      useClass: ListsService,
    },
  ],
})
export class ListsModule {}
