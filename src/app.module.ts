import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/modules/auth.module';
import { UserModule } from './application/modules/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/faif'),
    AuthModule,
    UserModule
  ],
})
export class AppModule {}
