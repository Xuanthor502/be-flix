import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditFields } from '../utils/audit.entity';
import { HydratedDocument } from 'mongoose';

export type ListDocument = HydratedDocument<List>;

@Schema({ timestamps: true })
export class List extends AuditFields {
  @Prop({ required: true })
  title: string;

  @Prop()
  type: string;

  @Prop()
  genre: string;

  @Prop({ type: [String] })
  content: string[];
}

export const ListSchema = SchemaFactory.createForClass(List);
