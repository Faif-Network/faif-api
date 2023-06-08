import { Injectable } from '@nestjs/common';
import { FollowersRepository } from 'src/infrastructure/repositories/followers.repository';

@Injectable()
export class FollowersService {
  constructor(private readonly followersRepository: FollowersRepository) {}

  async createFollower(user_id: string, follower_id: string): Promise<void> {
    console.table({ user_id, follower_id });
    const is_following = await this.followersRepository.isUserFollowing(
      user_id,
      follower_id
    );
    if (is_following) {
      await this.deleteFollower(user_id, follower_id);
      return;
    }
    await this.followersRepository.createFollower(user_id, follower_id);
  }

  async findFollowersAndFollowingNumber(
    user_to_find: string,
    me?: string
  ): Promise<{
    num_followers: number;
    num_following: number;
    is_following: boolean;
  }> {
    const { num_followers, num_following } =
      await this.followersRepository.findFollowersAndFollowingNumber(
        user_to_find
      );
    const is_following = await this.followersRepository.isUserFollowing(
      me,
      user_to_find
    );

    return { num_followers, num_following, is_following };
  }

  async deleteFollower(user_id: string, follower_id: string): Promise<void> {
    await this.followersRepository.deleteFollower(user_id, follower_id);
  }
}
