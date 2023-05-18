import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = PostEntity & Document;

@Schema({ timestamps: true, collection: 'posts' })
export class PostEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  attachment: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true, default: 0 })
  num_likes: number;

  @Prop({ required: true, default: 0 })
  num_comments: number;

  @Prop({ required: true, default: 0 })
  num_shares: number;

  @Prop({ required: true })
  num_views: number;

  @Prop({ required: false })
  deleted_at: number;
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);
