import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentEntity, CommentSchema } from "src/infrastructure/entities/comment.entity";
import { PostEntity, PostSchema } from "src/infrastructure/entities/post.entity";
import { CommentRepository } from "src/infrastructure/repositories/comment.repository";
import { PostRepository } from "src/infrastructure/repositories/post.repository";
import { CommentController } from "../controllers/comment.controller";
import { CommentService } from "../services/comment.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentEntity.name, schema: CommentSchema },
      {name: PostEntity.name, schema: PostSchema}
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository],
  exports: [CommentService]
})

export class CommentModule {}