import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from './permission.entity';
import { AuditFields } from '../utils/audit.entity';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends AuditFields {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
