import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';
import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyChats(@Req() req) {
    const { user_id } = req.user;
    const chats = await this.chatService.getChatsByUserId(user_id);
    return {
      message: 'Chats retrieved successfully',
      data: chats,
    };
  }

  @Get('/:chat_id')
  @UseGuards(JwtAuthGuard)
  async getChatById(@Req() req) {
    const { chat_id } = req.params;
    const chat = await this.chatService.getChatById(chat_id);
    return {
      message: 'Chat retrieved successfully',
      data: chat,
    };
  }

  @Get('/:chat_id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessagesByChatId(@Req() req) {
    const { chat_id } = req.params;
    const { user_id } = req.user;
    const messages = await this.messageService.findMessagesByChatIdAndUserId(
      chat_id,
      user_id
    );
    return {
      message: 'Messages retrieved successfully',
      data: messages,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createChat(@Req() req) {
    const { user_id } = req.user;
    const { receiver } = req.body;
    const chat = await this.chatService.createChat([user_id, receiver]);
    return {
      message: 'Chat created successfully',
      data: chat,
    };
  }
}
