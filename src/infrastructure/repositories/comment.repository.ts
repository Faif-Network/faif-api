import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentEntity } from '../entities/comment.entity';

export interface ICommentRepository {
  createComment(comment: Partial<CommentEntity>): Promise<CommentEntity>;
  findCommentsByPostId(post_id: string): Promise<CommentEntity[]>;
}

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectModel(CommentEntity.name)
    private readonly commentModel: Model<CommentEntity>
  ) {}

  async findCommentById(comment_id: string): Promise<CommentEntity> {
    return await this.commentModel.findOne({ id: comment_id }).exec();
  }

  async findCommentsByPostId(post_id: string): Promise<CommentEntity[]> {
    return this.commentModel.find({ post_id, deleted_at: null }).exec();
  }

  async createComment(comment: Partial<CommentEntity>): Promise<CommentEntity> {
    const comment_id = new Types.ObjectId();

    const created_comment = new this.commentModel({
      _id: comment_id,
      id: comment_id.toString(),
      user_id: comment.user_id,
      content: comment.content,
      created_at: new Date().getTime(),
      num_likes: comment.num_likes,
      post_id: comment.post_id,
      deleted_at: null,
    });

    await created_comment.save();
    return created_comment;
  }

  async deleteComment(comment_id: string): Promise<void> {
    await this.commentModel.updateOne(
      { id: comment_id },
      {
        deleted_at: new Date().getTime(),
      }
    );
  }
}
