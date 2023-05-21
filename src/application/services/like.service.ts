import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../../infrastructure/repositories/like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async getLikesByPostId(post_id: string) {
    return this.likeRepository.searchLikesByPostId(post_id);
  }

  async createLike(post_id: string, user_id: string) {
    await this.likeRepository.createLike(post_id, user_id);
  }

  async deleteLikeById(id: string) {
    await this.likeRepository.deleteLikeById(id);
  }

  async findLikeByPostIdAndUserId(post_id: string, user_id: string) {
    return this.likeRepository.findLikeByPostIdAndUserId(post_id, user_id);
  }

  async findLikesByPostIdsAndUserId(
    post_ids: string[],
    user_id: string,
    filter?: string[]
  ) {
    return await this.likeRepository.findLikesByPostIdsAndUserId(
      post_ids,
      user_id
    );
  }
}
