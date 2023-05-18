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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  handleChat(
    client: Socket,
    message: { sender: string; receiver: string; message: string }
  ) {
    this.server.to(message.receiver).emit('chat', message);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, room: string) {
    client.leave(room);
  }
}
