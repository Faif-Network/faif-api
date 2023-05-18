import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserEntity,
  UserSchema,
} from '../../infrastructure/entities/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
