import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserEntity & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({
    required: false,
    unique: true,
    default:
      'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg',
  })
  avatar: string;

  @Prop({ required: false, unique: false })
  name: string;

  @Prop({ required: false, unique: false })
  last_name: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ required: true, unique: true })
  created_at: number;

  @Prop({ required: true, unique: true })
  updated_at: number;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
