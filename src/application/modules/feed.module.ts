import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostEntity, PostSchema } from "src/infrastructure/entities/post.entity";
import { PostRepository } from "src/infrastructure/repositories/post.repository";
import { FeedController } from "../controllers/feed.controller";
import { FeedService } from "../services/feed.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema}
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService, PostRepository],
  exports: [FeedService],
})

export class FeedModule {}