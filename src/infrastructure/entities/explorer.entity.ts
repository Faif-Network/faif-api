import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'explorers' })
export class ExplorerEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  short_description: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  attachment: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  updated_at: number;

  @Prop({ required: true })
  start_date: number;

  @Prop({ required: true })
  explorer_type: string;
}

export const ExplorerSchema = SchemaFactory.createForClass(ExplorerEntity);
