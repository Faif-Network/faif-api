import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentEntity, CommentSchema } from "../../infrastructure/entities/comment.entity";
import { PostEntity, PostSchema } from "../../infrastructure/entities/post.entity";
import { UserEntity, UserSchema } from "../../infrastructure/entities/user.entity";
import { CommentRepository } from "../../infrastructure/repositories/comment.repository";
import { PostRepository } from "../../infrastructure/repositories/post.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { CommentController } from "../controllers/comment.controller";
import { CommentService } from "../services/comment.service";
import { UserService } from "../services/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentEntity.name, schema: CommentSchema },
      { name: PostEntity.name, schema: PostSchema },
      { name: UserEntity.name, schema: UserSchema}
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository, UserService, UserRepository],
  exports: [CommentService]
})

export class CommentModule {}