import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentEntity,
  CommentSchema,
} from '../../infrastructure/entities/comment.entity';
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
import { LikeRepository } from '../../infrastructure/repositories/like.repository';
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PostController } from '../controllers/post.controller';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema },
      { name: CommentEntity.name, schema: CommentSchema },
      { name: UserEntity.name, schema: UserSchema },
      { name: LikeEntity.name, schema: LikeSchema },
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
  ],
  exports: [PostService],
})
export class PostModule {}
