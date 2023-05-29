import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunityEntity,
  CommunitySchema,
} from '../../infrastructure/entities/community.entity';
import {
  UserEntity,
  UserSchema,
} from '../../infrastructure/entities/user.entity';
import { CommunityRepository } from '../../infrastructure/repositories/community.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: CommunityEntity.name, schema: CommunitySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, CommunityRepository],
  exports: [UserService],
})
export class UserModule {}
