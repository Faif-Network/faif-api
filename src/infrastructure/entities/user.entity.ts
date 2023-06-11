import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserEntity & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true, index: { unique: true } })
  email: string;

  @Prop({ required: true, unique: true, index: { unique: false } })
  username: string;

  @Prop({
    index: false,
    required: false,
    unique: false,
    default:
      'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg',
  })
  avatar: string;

  @Prop({ required: false, unique: false, index: false })
  name: string;

  @Prop({ required: false, unique: false, index: false })
  last_name: string;

  @Prop({ required: true, unique: false, index: false })
  password: string;

  @Prop({ required: false, unique: false, index: false })
  biography: string;

  @Prop({ required: true, unique: false, index: false })
  created_at: number;

  @Prop({ required: true, unique: false, index: false })
  updated_at: number;

  @Prop({ required: false, unique: false, index: false })
  community_id: string;

  community?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
