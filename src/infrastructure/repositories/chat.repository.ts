import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatEntity } from '../entities/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatEntity.name)
    private readonly chatModel: Model<ChatEntity>
  ) {}

  async findChatByUsers(users: string[]): Promise<ChatEntity> {
    return this.chatModel
      .findOne({
        users: { $all: users },
      })
      .exec();
  }

  async findChatByUserId(user_id: string): Promise<ChatEntity[]> {
    return this.chatModel
      .find({
        users: {
          $in: [user_id],
        },
      })
      .exec();
  }

  async findChatById(chat_id: string): Promise<ChatEntity> {
    return this.chatModel.findOne({ id: chat_id }).exec();
  }

  async createChat(chat: Partial<ChatEntity>): Promise<ChatEntity> {
    const chat_id = new Types.ObjectId();

    const created_chat = new this.chatModel({
      _id: chat_id,
      id: chat_id.toString(),
      users: chat.users,
      created_at: new Date().getTime(),
      messages: [],
    });

    await created_chat.save();
    return created_chat;
  }

  async sendMessage(
    chat_id: string,
    sender: string,
    receiver: string,
    message: string
  ): Promise<ChatEntity> {
    const chat = await this.chatModel.findOne({ id: chat_id }).exec();

    chat.messages.push({
      sender: sender,
      receiver: receiver,
      message: message,
      created_at: new Date().getTime(),
    });
    await chat.save();
    return chat;
  }
}
