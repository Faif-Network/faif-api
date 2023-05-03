import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentEntity, CommentSchema } from "src/infrastructure/entities/comment.entity";
import { PostEntity, PostSchema } from "src/infrastructure/entities/post.entity";
import { CommentRepository } from "src/infrastructure/repositories/comment.repository";
import { PostRepository } from "src/infrastructure/repositories/post.repository";
import { FeedController } from "../controllers/feed.controller";
import { CommentService } from "../services/comment.service";
import { FeedService } from "../services/feed.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema },
      { name: CommentEntity.name, schema: CommentSchema}
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService, PostRepository, CommentService, CommentRepository],
  exports: [FeedService],
})

export class FeedModule {}