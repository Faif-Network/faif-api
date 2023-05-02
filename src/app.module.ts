import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/modules/auth.module';
import { FeedModule } from './application/modules/feed.module';
import { UserModule } from './application/modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/faif'),
    AuthModule,
    UserModule,
    FeedModule
  ],
})
export class AppModule {}
