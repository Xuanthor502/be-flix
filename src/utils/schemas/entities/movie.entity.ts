import { HydratedDocument } from 'mongoose';
import { AuditFields } from '../utils/audit.entity';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type MovieDocument = HydratedDocument<Movie>;

export class Movie extends AuditFields {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  img: string;

  @Prop()
  imgTitle: string;

  @Prop()
  imgSm: string;

  @Prop()
  trailer: string;

  @Prop()
  video: string;

  @Prop()
  year: string;

  @Prop()
  limit: number;

  @Prop()
  genrce: string;

  @Prop({ default: false })
  isSeries: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
