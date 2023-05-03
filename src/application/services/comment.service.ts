import { HttpException, Injectable } from "@nestjs/common";
import { CommentRepository } from "src/infrastructure/repositories/comment.repository";
import { PostRepository } from "src/infrastructure/repositories/post.repository";

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository
  ) { }
  
  async getCommentsByPostId(post_id: string) {
    const post = await this.postRepository.findPostById(post_id)
    if (!post) {
      throw new HttpException("Post not found", 404)
    }
    const comments = await this.commentRepository.findCommentsByPostId(post_id)
    return comments
  }
  
  async createComment(post_id: string, data: CreateCommentDTO) {
    const post = await this.postRepository.findPostById(post_id)
    if (!post) {
      throw new HttpException("Post not found", 404)
    }
    await this.commentRepository.createComment({
      content: data.content,
      user_id: data.user_id,
      post_id: post.id
    })
  }
}

interface CreateCommentDTO {
  user_id: string
  content: string;
}