import { Injectable } from "@nestjs/common";
import { PostRepository } from "../../infrastructure/repositories/post.repository";
import { CommentService } from "./comment.service";

@Injectable()
export class FeedService {

  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentService: CommentService
  ) {}

  async getFeed(): Promise<FeedResponse[]> {
    const posts = await this.postRepository.searchPosts();
    return posts.map(post => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      attachment: post.attachment,
      num_likes: post.num_likes,
      num_comments: post.num_comments,
      created_at: post.created_at
    }));
  }

  async createPost(payload: CreatePostDTO): Promise<string> {    
    return this.postRepository.createPost({
      user_id: payload.user_id,
      content: payload.content,
      attachment: payload.attachment
    }).then(post => post.id);
  }

  async getCommentsByPostId(post_id: string) {
    return this.commentService.getCommentsByPostId(post_id);
  }
}

export interface FeedResponse {
  id: string;
  user_id: string,
  content: string,
  attachment: string,
  num_likes: number,
  num_comments: number
  created_at: number
}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}