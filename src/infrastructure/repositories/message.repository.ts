import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageEntity.name)
    private readonly messageModel: Model<MessageEntity>
  ) {}

  async findMessagesByChatId(chat_id: string): Promise<MessageEntity[]> {
    return this.messageModel
      .find({ chat_id: chat_id })
      .sort({ created_at: 1 })
      .exec();
  }

  async findLatestMessageByChatId(chat_id: string): Promise<MessageEntity> {
    return this.messageModel
      .findOne({ chat_id: chat_id })
      .sort({ created_at: -1 })
      .exec();
  }

  async findMessagesByChatIdAndUserId(
    chat_id: string,
    user_id: string
  ): Promise<MessageEntity[]> {
    return this.messageModel
      .find({
        chat_id: chat_id,
        $or: [{ sender: user_id }, { receiver: user_id }],
      })
      .exec();
  }

  async sendMessage(data: SendMessageDTO): Promise<MessageEntity> {
    const { chat_id, sender, receiver, message } = data;
    const id = new Types.ObjectId();
    const msg = new this.messageModel({
      _id: id,
      id: id.toString(),
      chat_id: chat_id,
      sender: sender,
      receiver: receiver,
      message: message,
      created_at: new Date().getTime(),
      seen: false,
    });
    return msg.save();
  }
}

interface SendMessageDTO {
  chat_id: string;
  sender: string;
  receiver: string;
  message: string;
}
