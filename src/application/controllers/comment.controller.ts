import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { IUserAuth, JwtAuthGuard } from "src/shared/jwt-auth.guard";
import { CommentService } from "../services/comment.service";

@Controller("comments")
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }
  
  @Post("/:post_id")
  @UseGuards(JwtAuthGuard)
  async createCommment(@Body() body: CreateCommentDTO, @Req() req) {
    const { user_id } = req.user as IUserAuth
    const { post_id } = req.params
    const { content } = body

    if (!content) {
      throw new HttpException("Content is required", HttpStatus.BAD_REQUEST);
    }

    const comment = await this.commentService.createComment(post_id, {
      user_id,
      content: body.content
    })

    return {
      message: "Comment created successfully",
      comment_id: comment
    }
  }
}

interface CreateCommentDTO {
  content: string;
}