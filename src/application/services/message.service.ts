import { Injectable } from '@nestjs/common';
import { MessageRepository } from 'src/infrastructure/repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async findMessagesByChatId(chat_id: string) {
    return await this.messageRepository.findMessagesByChatId(chat_id);
  }

  async findLatestMessageByChatId(chat_id: string) {
    return await this.messageRepository.findLatestMessageByChatId(chat_id);
  }

  async findMessagesByChatIdAndUserId(chat_id: string, user_id: string) {
    const messages = await this.messageRepository.findMessagesByChatIdAndUserId(
      chat_id,
      user_id
    );
    return messages.map((message) => {
      return {
        id: message.id,
        chat_id: message.chat_id,
        sender: message.sender,
        receiver: message.receiver,
        message: message.message,
        created_at: message.created_at,
        seen: message.seen,
        is_sender: message.sender === user_id,
      };
    });
  }

  async sendMessage(data: SendMessageDTO) {
    return await this.messageRepository.sendMessage(data);
  }
}

interface SendMessageDTO {
  chat_id: string;
  sender: string;
  receiver: string;
  message: string;
}
