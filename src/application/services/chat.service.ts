import { ChatRepository } from "src/infrastructure/repositories/chat.repository"

export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository
  ) { }
  
  async getChatsByUserId(user_id: string) {
    return await this.chatRepository.findChatByUserId(user_id)
  }

  async getChatById(chat_id: string) {
    return await this.chatRepository.findChatById(chat_id)
  }

  async getChatByUsers(users: string[]) {
    return await this.chatRepository.findChatByUsers(users)
  }

  async createChat(data: CreateChatDTO) {
    return await this.chatRepository.createChat(data)
  }

  async sendMessage(data: SendMessageDTO) {
    const { chat_id, sender, receiver, message } = data
    return await this.chatRepository.sendMessage(chat_id, sender, receiver, message)
  }
}

interface CreateChatDTO {
  users: string[]
}

interface SendMessageDTO {
  chat_id: string
  sender: string
  receiver: string
  message: string
}