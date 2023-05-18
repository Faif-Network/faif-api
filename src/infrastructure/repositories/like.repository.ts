import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikeEntity } from '../entities/like.entity';

export interface ILikeRepository {
  searchLikesByPostId(post_id: string): Promise<LikeEntity[]>;
  createLike(post_id: string, user_id: string): Promise<void>;
  findLikeByPostIdAndUserId(
    post_id: string,
    user_id: string
  ): Promise<LikeEntity | null>;
  deleteLikeById(id: string): Promise<void>;
  findLikesByPostIdsAndUserId(
    post_ids: string[],
    user_id: string
  ): Promise<LikeEntity[]>;
}

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @InjectModel(LikeEntity.name)
    private readonly likeModel: Model<LikeEntity>
  ) {}

  searchLikesByPostId(post_id: string): Promise<LikeEntity[]> {
    return this.likeModel
      .find({
        post_id,
      })
      .exec();
  }

  findLikeByPostIdAndUserId(
    post_id: string,
    user_id: string
  ): Promise<LikeEntity> {
    return this.likeModel
      .findOne({
        post_id,
        user_id,
      })
      .exec();
  }

  createLike(post_id: string, user_id: string): Promise<void> {
    const like_id = new Types.ObjectId();
    const created_like = new this.likeModel({
      _id: like_id,
      id: like_id.toString(),
      user_id,
      post_id,
      created_at: new Date().getTime(),
    });
    return created_like.save().then(() => {});
  }

  deleteLikeById(id: string): Promise<void> {
    return this.likeModel
      .deleteOne({
        id,
      })
      .exec() as any;
  }

  findLikesByPostIdsAndUserId(
    post_ids: string[],
    user_id: string
  ): Promise<LikeEntity[]> {
    return this.likeModel
      .find({
        post_id: {
          $in: post_ids,
        },
        user_id,
      })
      .exec();
  }
}
