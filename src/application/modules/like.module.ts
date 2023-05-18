import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LikeEntity,
  LikeSchema,
} from '../../infrastructure/entities/like.entity';
import {
  PostEntity,
  PostSchema,
} from '../../infrastructure/entities/post.entity';
import { LikeRepository } from '../../infrastructure/repositories/like.repository';
import { LikeService } from '../services/like.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema },
      { name: LikeEntity.name, schema: LikeSchema },
    ]),
  ],
  controllers: [],
  providers: [LikeService, LikeRepository],
  exports: [LikeService],
})
export class LikeModule {}
