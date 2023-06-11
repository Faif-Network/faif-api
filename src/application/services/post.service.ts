import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { HttpException, Injectable } from '@nestjs/common';
import { LikeEntity } from 'src/infrastructure/entities/like.entity';
import { PostEntity } from 'src/infrastructure/entities/post.entity';
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
    filter?: string[],
    user_id?: string
  ): Promise<FeedResponse[]> {
    const posts = await this.postRepository.searchPosts(filter);
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
      attachment_type: post.attachment_type,
      ...(likes && { liked: !!likes.find((like) => like.post_id === post.id) }),
      ...(users && { user: users.find((user) => user.id === post.user_id) }),
    }));
  }

  async createPost(
    payload: CreatePostDTO
  ): Promise<{ id: string; attachment_url: string }> {
    let attachment_url: string | null = null;
    let public_url: string | null = null;
    if (payload.attachment) {
      const blob_conn = process.env.AZURE_CONNECTION_STRING;
      if (!blob_conn) {
        throw new Error('Azure connection string is not defined');
      }

      const blob_service_client =
        BlobServiceClient.fromConnectionString(blob_conn);

      const container_client =
        blob_service_client.getContainerClient('attachments');
      const blob_name = `${new Date().valueOf()}-${payload.user_id}.${
        payload.attachment.split('/')[1]
      }`;
      const block_blob_client = container_client.getBlockBlobClient(blob_name);

      // Generate SAS token for the blob
      attachment_url = await block_blob_client.generateSasUrl({
        permissions: BlobSASPermissions.parse('racwd'),
        expiresOn: new Date(new Date().valueOf() + 86400),
        contentType:
          payload.attachment?.split('.').pop() || 'application/octet-stream',
      });

      public_url = block_blob_client.url;
    }
    let attachment_type: string | null = null;
    if (payload.attachment && payload.attachment === 'image/png') {
      attachment_type = 'image';
    } else if (payload.attachment && payload.attachment === 'image/jpeg') {
      attachment_type = 'image';
    } else if (payload.attachment && payload.attachment === 'image/jpg') {
      attachment_type = 'image';
    } else if (payload.attachment && payload.attachment === 'application/pdf') {
      attachment_type = 'pdf';
    }

    const post = await this.postRepository.createPost({
      user_id: payload.user_id,
      content: payload.content,
      attachment: payload.attachment ? public_url : null,
      attachment_type,
    });

    return {
      id: post.id,
      attachment_url,
    };
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

  async deletePost(post_id: string, user_id: string): Promise<void> {
    const post = await this.postRepository.findPostById(post_id);
    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    if (post.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    await this.postRepository.deletePostById(post_id);
  }

  async getPostById(post_id: string): Promise<PostEntity> {
    const post = await this.postRepository.findPostById(post_id);
    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return post;
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
