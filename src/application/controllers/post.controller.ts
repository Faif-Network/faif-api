import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/shared/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { CreateCommentDTO } from '../services/comment.service';
import { PostService } from '../services/post.service';

@Controller('feed')
export class PostController {
  constructor(private readonly feedService: PostService) {}

  @Get('/posts')
  @UseGuards(OptionalJwtAuthGuard)
  async getFeed(@Req() req) {
    const { user_id } = req.user;
    const { populate, filter } = req.query;
    const posts = await this.feedService.getFeed(
      populate ? populate : undefined,
      filter ? filter : undefined,
      user_id ? user_id : undefined
    );
    return {
      message: 'Posts retrieved successfully',
      data: posts,
    };
  }

  @Post('/posts')
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() body: CreatePostDTO, @Req() req) {
    const user_id = req.user.user_id;

    if (!body.content) {
      throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.feedService.createPost({
      user_id: user_id,
      content: body.content,
      attachment: body.attachment,
    });

    if (!post) {
      throw new HttpException(
        'Post could not be created',
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      message: 'Post created successfully',
      data: {
        post_id: post,
      },
    };
  }

  @Get('/posts/:post_id/comments')
  async getCommentsByPostId(@Req() req) {
    const { populate } = req.query;
    const { post_id } = req.params;
    const comments = await this.feedService.getCommentsByPostId(
      post_id,
      populate ? populate : undefined
    );
    return {
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }

  @Post('/posts/:post_id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() body: CreateCommentDTO, @Req() req) {
    const { user_id } = req.user;
    const { post_id } = req.params;
    const { content } = body;

    if (!post_id)
      if (!content) {
        throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
      }

    const comment = await this.feedService.createComment(post_id, {
      user_id,
      content: body.content,
    });

    return {
      message: 'Comment created successfully',
      data: {
        comment_id: comment,
      },
    };
  }

  @Post('/posts/:post_id/likes')
  @UseGuards(JwtAuthGuard)
  async likePost(@Req() req) {
    const { user_id } = req.user;
    const { post_id } = req.params;

    if (!post_id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }

    await this.feedService.likePost(post_id, user_id);

    return {
      message: 'Post liked successfully',
      data: null,
    };
  }
}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}
