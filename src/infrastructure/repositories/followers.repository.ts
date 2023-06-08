import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FollowerEntity } from '../entities/followers.entity';

@Injectable()
export class FollowersRepository {
  constructor(
    @InjectModel(FollowerEntity.name)
    private readonly followerModel: Model<FollowerEntity>
  ) {}

  async createFollower(
    user_id: string,
    follower_id: string
  ): Promise<FollowerEntity> {
    console.log('user_id', user_id);
    console.log('follower_id', follower_id);
    const id = new Types.ObjectId();
    const follower = new this.followerModel({
      _id: id,
      id: id.toString(),
      user_id,
      follower_id,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      deleted_at: null,
    });
    return await follower.save();
  }

  async isUserFollowing(
    user_id: string,
    follower_id: string
  ): Promise<boolean> {
    const follower = await this.followerModel
      .findOne({ user_id, follower_id, deleted_at: null })
      .exec();
    return !!follower;
  }

  async findFollowersAndFollowingNumber(
    user_id: string
  ): Promise<{ num_followers: number; num_following: number }> {
    const num_followers = await this.followerModel
      .find({ follower_id: user_id, deleted_at: null })
      .countDocuments()
      .exec();

    const num_following = await this.followerModel
      .find({ user_id, deleted_at: null })
      .countDocuments()
      .exec();

    return { num_followers, num_following };
  }

  async deleteFollower(user_id: string, follower_id: string): Promise<void> {
    await this.followerModel.findOneAndDelete({ user_id, follower_id }).exec();
  }
}
