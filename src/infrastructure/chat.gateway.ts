import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/application/services/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleChat(
    client: Socket,
    message: {
      sender: string;
      receiver: string;
      message: string;
      chat_id: string;
    }
  ) {
    // Emit chat to everyone in the room
    const msg = await this.messageService.sendMessage({
      chat_id: message.chat_id,
      sender: message.sender,
      receiver: message.receiver,
      message: message.message,
    });
    this.server.to(message.chat_id).emit('listMessages', {
      id: msg.id,
      chat_id: msg.chat_id,
      sender: msg.sender,
      receiver: msg.receiver,
      message: msg.message,
    });
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string) {
    client.join(room);
    Logger.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, room: string) {
    client.leave(room);
    Logger.log(`Client ${client.id} left room ${room}`);
  }
}
