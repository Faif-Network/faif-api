import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/modules/auth.module';
import { CommentModule } from './application/modules/comment.module';
import { FeedModule } from './application/modules/feed.module';
import { UserModule } from './application/modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    FeedModule,
    CommentModule
  ],
})
export class AppModule {}
