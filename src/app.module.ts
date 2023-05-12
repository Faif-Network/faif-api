import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/modules/auth.module';
import { ChatModule } from './application/modules/chat.module';
import { CommentModule } from './application/modules/comment.module';
import { FeedModule } from './application/modules/feed.module';
import { UserModule } from './application/modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.DB_URI,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    FeedModule,
    CommentModule,
    ChatModule
  ],
})
export class AppModule {}
