import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FollowerEntity,
  FollowerSchema,
} from 'src/infrastructure/entities/followers.entity';
import {
  UserEntity,
  UserSchema,
} from 'src/infrastructure/entities/user.entity';
import { FollowersRepository } from 'src/infrastructure/repositories/followers.repository';
import { FollowersController } from '../controllers/followers.controller';
import { FollowersService } from '../services/followers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: FollowerEntity.name, schema: FollowerSchema },
    ]),
  ],
  controllers: [FollowersController],
  providers: [FollowersService, FollowersRepository],
})
export class FollowersModule {}
