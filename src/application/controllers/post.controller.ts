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
import { PollService } from '../services/poll.service';
import { PostService } from '../services/post.service';

@Controller('feed')
export class PostController {
  constructor(
    private readonly feedService: PostService,
    private readonly pollService: PollService
  ) {}

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
    const polls = await this.pollService.getPolls(
      populate ? populate : undefined
    );

    // Merge posts and polls into one array and sort by created_at
    const feed = [...posts, ...polls].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return {
      message: 'Posts retrieved successfully',
      data: feed,
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
        post,
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

  @Post('/polls')
  @UseGuards(JwtAuthGuard)
  async createPoll(@Req() req) {
    const { user_id } = req.user;
    const { question, options, attachment_type } = req.body;

    if (!question) {
      throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
    }

    if (!options) {
      throw new HttpException('Options are required', HttpStatus.BAD_REQUEST);
    }

    const poll = await this.pollService.createPoll({
      user_id,
      question,
      options,
      attachment_type,
    });

    return {
      message: 'Poll created successfully',
      data: {
        poll_id: poll,
      },
    };
  }

  @Post('/polls/:poll_id/votes')
  @UseGuards(JwtAuthGuard)
  async votePoll(@Req() req) {
    const { user_id } = req.user;
    const { poll_id } = req.params;
    const { option } = req.body;

    if (!poll_id) {
      throw new HttpException('Poll id is required', HttpStatus.BAD_REQUEST);
    }

    if (!option) {
      throw new HttpException('Option  is required', HttpStatus.BAD_REQUEST);
    }

    await this.pollService.submitVote(poll_id, {
      option,
      user_id,
    });

    return {
      message: 'Poll voted successfully',
      data: null,
    };
  }
}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}
