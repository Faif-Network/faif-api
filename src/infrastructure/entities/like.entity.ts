import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = LikeEntity & Document;

@Schema({ timestamps: true, collection: 'likes' })
export class LikeEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  post_id: string;

  @Prop({ required: true })
  created_at: number;
}

export const LikeSchema = SchemaFactory.createForClass(LikeEntity);
