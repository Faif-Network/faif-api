import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatGateway } from "src/infrastructure/chat.gateway";
import { ChatEntity, ChatSchema } from "src/infrastructure/entities/chat.entity";
import { ChatService } from "../services/chat.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatEntity.name, schema: ChatSchema }
    ])
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}