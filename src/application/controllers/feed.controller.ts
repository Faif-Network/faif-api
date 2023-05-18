import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../shared/jwt-auth.guard";
import { FeedService } from "../services/feed.service";

@Controller("feed")
export class FeedController {

  constructor(
    private readonly feedService: FeedService,
  ) { }
  
  @Get("/posts")
  async getFeed(@Req() req) {
    const { populate } = req.query;
    const posts = await this.feedService.getFeed(populate ? populate : undefined);
    return {
      message: "Posts retrieved successfully",
      data: posts
    }
  }

  @Post("/posts")
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() body: CreatePostDTO, @Req() req) {

    const user_id = req.user.user_id;

    if (!body.content) {
      throw new HttpException("Content is required", HttpStatus.BAD_REQUEST);
    }

    const post = await this.feedService.createPost({
      user_id: user_id,
      content: body.content,
      attachment: body.attachment
    });

    if (!post) {
      throw new HttpException("Post could not be created", HttpStatus.BAD_REQUEST);
    }

    return {
      message: "Post created successfully",
      data: {
        post_id: post,
      }
    }
  }

  @Get("/posts/:post_id/comments")
  async getCommentsByPostId(@Req() req) {
    const { populate } = req.query;
    const { post_id } = req.params;
    const comments = await this.feedService.getCommentsByPostId(post_id, populate ? populate : undefined);
    return {
      message: "Comments retrieved successfully",
      data: comments
    }
  }

}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}