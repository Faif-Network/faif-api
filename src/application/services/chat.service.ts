import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../../infrastructure/repositories/chat.repository';
import { MessageService } from './message.service';
import { UserService } from './user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {}

  async getChatsByUserId(user_id: string) {
    const chats = await this.chatRepository.findChatByUserId(user_id);
    const promises = chats.map(async (chat) => {
      const user = chat.users.filter((user) => user !== user_id)[0];
      const { username, avatar } = await this.userService.findById(user);
      const last_message = await this.messageService.findLatestMessageByChatId(
        chat.id
      );
      return {
        chat_id: chat.id,
        users: chat.users,
        last_message: last_message?.message,
        last_message_date: last_message?.created_at,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        user: {
          username: username,
          avatar: avatar,
        },
      };
    });

    return Promise.all(promises);
  }

  async getChatById(chat_id: string) {
    const chat = await this.chatRepository.findChatById(chat_id);
    return {
      chat_id: chat.id,
      users: chat.users,
      created_at: chat.created_at,
    };
  }

  async getChatByUsers(users: string[]) {
    return await this.chatRepository.findChatByUsers(users);
  }

  async createChat(users: string[]) {
    return await this.chatRepository.createChat({
      users: users,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    });
  }
}

interface SendMessageDTO {
  chat_id: string;
  sender: string;
  receiver: string;
  message: string;
}
