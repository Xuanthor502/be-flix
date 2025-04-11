import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AuditFields } from '../utils/audit.entity';
import { HydratedDocument } from 'mongoose';

export type ListDocument = HydratedDocument<List>;

export class List extends AuditFields {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  type: string;

  @Prop()
  genre: string;

  @Prop()
  content: any[];
}

export const ListSchema = SchemaFactory.createForClass(List);
