import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PollEntity,
  PollSchema,
} from 'src/infrastructure/entities/poll.entity';
import { PollRepository } from 'src/infrastructure/repositories/poll.repository';
import {
  CommentEntity,
  CommentSchema,
} from '../../infrastructure/entities/comment.entity';
import {
  CommunityEntity,
  CommunitySchema,
} from '../../infrastructure/entities/community.entity';
import {
  LikeEntity,
  LikeSchema,
} from '../../infrastructure/entities/like.entity';
import {
  PostEntity,
  PostSchema,
} from '../../infrastructure/entities/post.entity';
import {
  UserEntity,
  UserSchema,
} from '../../infrastructure/entities/user.entity';
import { CommentRepository } from '../../infrastructure/repositories/comment.repository';
import { CommunityRepository } from '../../infrastructure/repositories/community.repository';
import { LikeRepository } from '../../infrastructure/repositories/like.repository';
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PostController } from '../controllers/post.controller';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { PollService } from '../services/poll.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema },
      { name: CommentEntity.name, schema: CommentSchema },
      { name: UserEntity.name, schema: UserSchema },
      { name: LikeEntity.name, schema: LikeSchema },
      { name: CommunityEntity.name, schema: CommunitySchema },
      { name: PollEntity.name, schema: PollSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    CommentService,
    CommentRepository,
    UserService,
    UserRepository,
    LikeService,
    LikeRepository,
    CommunityRepository,
    PollService,
    PollRepository,
  ],
  exports: [PostService],
})
export class PostModule {}
