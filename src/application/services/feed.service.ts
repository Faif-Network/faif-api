import { Injectable, Logger } from "@nestjs/common";
import { PostEntity } from "src/infrastructure/entities/post.entity";
import { PostRepository } from "src/infrastructure/repositories/post.repository";

@Injectable()
export class FeedService {

  constructor(
    private readonly postRepository: PostRepository
  ) {}

  async getFeed(): Promise<PostEntity[]> {
    return this.postRepository.searchPosts();
  }

  async createPost(payload: CreatePostDTO): Promise<string> {

    Logger.log(`Creating post for user ${payload.user_id}`);
    

    return this.postRepository.createPost({
      user_id: payload.user_id,
      content: payload.content,
      attachment: payload.attachment
    }).then(post => post.id);
  }
}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}