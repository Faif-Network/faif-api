import { HttpException, Injectable } from "@nestjs/common";
import { CommentRepository } from "../../infrastructure/repositories/comment.repository";
import { PostRepository } from "../../infrastructure/repositories/post.repository";
import { UserService } from "./user.service";

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userService: UserService
  ) { }
  
  async getCommentsByPostId(post_id: string, populate?: string[]) {
    const post = await this.postRepository.findPostById(post_id)
    if (!post) {
      throw new HttpException("Post not found", 404)
    }
    const comments = await this.commentRepository.findCommentsByPostId(post_id)

    if (populate && populate.includes('user')) {
      const user_ids = new Set(comments.map(comment => comment.user_id))
      const users = await this.userService.searchUsers(Array.from(user_ids))
      return comments.map(comment => ({
        id: comment.id,
        user_id: comment.user_id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        user: users.find(user => user.id === comment.user_id)
      }))
    }

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