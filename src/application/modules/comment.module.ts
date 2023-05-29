import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentEntity,
  CommentSchema,
} from '../../infrastructure/entities/comment.entity';
import {
  CommunityEntity,
  CommunitySchema,
} from '../../infrastructure/entities/community.entity';
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
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CommentController } from '../controllers/comment.controller';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentEntity.name, schema: CommentSchema },
      { name: PostEntity.name, schema: PostSchema },
      { name: UserEntity.name, schema: UserSchema },
      { name: CommunityEntity.name, schema: CommunitySchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    PostRepository,
    UserService,
    UserRepository,
    CommunityRepository,
  ],
  exports: [CommentService],
})
export class CommentModule {}
