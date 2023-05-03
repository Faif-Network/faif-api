import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/shared/jwt-auth.guard";
import { FeedService } from "../services/feed.service";

@Controller("feed")
export class FeedController {

  constructor(
    private readonly feedService: FeedService,
  ) { }
  
  @Get("/posts")
  async getFeed() {
    return await this.feedService.getFeed();
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
      post_id: post
    }
  }

  @Get("/posts/:post_id/comments")
  async getCommentsByPostId(@Req() req) {
    const { post_id } = req.params;
    return await this.feedService.getCommentsByPostId(post_id);
  }



}

interface CreatePostDTO {
  user_id: string;
  content: string;
  attachment?: string;
}