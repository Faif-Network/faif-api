import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from 'src/infrastructure/chat.gateway';
import {
  MessageEntity,
  MessageSchema,
} from 'src/infrastructure/entities/message.entity';
import {
  UserEntity,
  UserSchema,
} from 'src/infrastructure/entities/user.entity';
import { ChatRepository } from 'src/infrastructure/repositories/chat.repository';
import { MessageRepository } from 'src/infrastructure/repositories/message.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import {
  ChatEntity,
  ChatSchema,
} from '../../infrastructure/entities/chat.entity';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatEntity.name, schema: ChatSchema },
      { name: UserEntity.name, schema: UserSchema },
      { name: MessageEntity.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    ChatRepository,
    UserService,
    UserRepository,
    MessageService,
    MessageRepository,
  ],
  exports: [ChatService],
})
export class ChatModule {}
