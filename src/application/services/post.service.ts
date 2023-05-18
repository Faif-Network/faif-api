import { Injectable } from '@nestjs/common';
import { LikeEntity } from 'src/infrastructure/entities/like.entity';
import { UserEntity } from 'src/infrastructure/entities/user.entity';
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { CommentService, CreateCommentDTO } from './comment.service';
import { LikeService } from './like.service';
import { UserService } from './user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly likeService: LikeService
  ) {}

  async getFeed(
    populate?: string[],
    user_id?: string
  ): Promise<FeedResponse[]> {
    const posts = await this.postRepository.searchPosts();
    const postIds = posts.map((post) => post.id);
    let likesPromise: Promise<LikeEntity[]>;
    let usersPromise: Promise<Partial<UserEntity>[]>;

    if (user_id || (populate && populate.includes('user'))) {
      likesPromise = this.likeService.findLikesByPostIdsAndUserId(
        postIds,
        user_id
      );
    }

    if (populate && populate.includes('user')) {
      const user_ids = new Set(posts.map((post) => post.user_id));
      usersPromise = this.userService.searchUsers(Array.from(user_ids));
    }

    const [likes, users] = await Promise.all([likesPromise, usersPromise]);

    return posts.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      attachment: post.attachment,
      num_likes: post.num_likes,
      num_comments: post.num_comments,
      created_at: post.created_at,
      ...(likes && { liked: !!likes.find((like) => like.post_id === post.id) }),
      ...(users && { user: users.find((user) => user.id === post.user_id) }),
    }));
  }

  async createPost(payload: CreatePostDTO): Promise<string> {
    return this.postRepository
      .createPost({
        user_id: payload.user_id,
        content: payload.content,
        attachment: payload.attachment,
      })
      .then((post) => post.id);
  }

  async getCommentsByPostId(post_id: string, populate?: string[]) {
    return this.commentService.getCommentsByPostId(post_id, populate);
  }

  async createComment(
    post_id: string,
    payload: CreateCommentDTO
  ): Promise<void> {
    await Promise.all([
      this.commentService.createComment(post_id, payload),
      this.postRepository.incrementNumComments(post_id),
    ]);
  }

  async likePost(post_id: string, user_id: string): Promise<void> {
    const like_exists = await this.likeService.findLikeByPostIdAndUserId(
      post_id,
      user_id
    );

    if (like_exists) {
      await Promise.all([
        this.likeService.deleteLikeById(like_exists.id),
        this.postRepository.decrementNumLikes(post_id),
      ]);
      return;
    }

    await Promise.all([
      this.likeService.createLike(post_id, user_id),
      this.postRepository.incrementNumLikes(post_id),
    ]);
  }
}

export interface FeedResponse {
  id: string;
  user_id: string;
  content: string;
  attachment: string;
  num_likes: number;
  num_comments: number;
  created_at: number;
}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}
