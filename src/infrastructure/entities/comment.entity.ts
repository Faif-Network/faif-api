import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = CommentEntity & Document;

@Schema({ timestamps: true, collection: 'comments' })
export class CommentEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  post_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true, default: 0 })
  num_likes: number;

  @Prop({ required: false, default: null })
  deleted_at: number;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
