import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'messages' })
export class MessageEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  chat_id: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  seen: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(MessageEntity);
