import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'followers' })
export class FollowerEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  follower_id: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  updated_at: number;

  @Prop({ required: false })
  deleted_at: number;
}

export const FollowerSchema = SchemaFactory.createForClass(FollowerEntity);
