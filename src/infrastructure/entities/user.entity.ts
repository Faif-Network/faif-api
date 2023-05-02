import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserEntity & Document;

@Schema({timestamps: true, collection: 'users'})
export class UserEntity {

  @Prop({ required: true })
  id: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true, unique: true})
  name: string;

  @Prop({ required: false, unique: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ required: true, unique: true })
  created_at: number;

  @Prop({ required: true, unique: true })
  updated_at: number;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
