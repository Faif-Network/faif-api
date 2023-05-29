import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from '../../infrastructure/chat.gateway';
import {
  ChatEntity,
  ChatSchema,
} from '../../infrastructure/entities/chat.entity';
import {
  CommunityEntity,
  CommunitySchema,
} from '../../infrastructure/entities/community.entity';
import {
  MessageEntity,
  MessageSchema,
} from '../../infrastructure/entities/message.entity';
import {
  UserEntity,
  UserSchema,
} from '../../infrastructure/entities/user.entity';
import { ChatRepository } from '../../infrastructure/repositories/chat.repository';
import { CommunityRepository } from '../../infrastructure/repositories/community.repository';
import { MessageRepository } from '../../infrastructure/repositories/message.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
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
      { name: CommunityEntity.name, schema: CommunitySchema },
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
    CommunityRepository,
  ],
  exports: [ChatService],
})
export class ChatModule {}
