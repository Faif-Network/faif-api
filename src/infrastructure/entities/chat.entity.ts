import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = ChatEntity & Document;

@Schema({ timestamps: true, collection: 'chats' })
export class ChatEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  users: string[];

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  updated_at: number;
}

export const ChatSchema = SchemaFactory.createForClass(ChatEntity);
