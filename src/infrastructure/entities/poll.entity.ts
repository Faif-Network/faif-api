import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Vote {
  @Prop({ required: true })
  option: string;

  @Prop({ required: true })
  user_id: string;
}

@Schema({ timestamps: true, collection: 'polls' })
export class PollEntity {
  is_poll: boolean;

  user?: any;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: false })
  attachment: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true, default: 0 })
  num_likes: number;

  @Prop({ required: false })
  deleted_at: number;

  @Prop({ required: false })
  attachment_type?: string;

  @Prop({ required: false })
  options: string[];

  @Prop({ required: false })
  votes: Vote[];
}

export const PollSchema = SchemaFactory.createForClass(PollEntity);

export type PollDocument = PollEntity & Document;
