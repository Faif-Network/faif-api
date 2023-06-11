import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CalendarDocument = CalendarEntity & Document;

@Schema({ timestamps: true, collection: 'calendar' })
export class CalendarEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  start_at: number;

  @Prop({ required: true })
  event_type: string;
}

export const CalendarSchema = SchemaFactory.createForClass(CalendarEntity);
