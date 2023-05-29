import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityEntity } from '../entities/community.entity';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectModel(CommunityEntity.name)
    private readonly communityModel: Model<CommunityEntity>
  ) {}

  async findCommunityBySlug(slug: string): Promise<CommunityEntity> {
    return this.communityModel.findOne({ slug }).exec();
  }

  async searchAllCommunities(): Promise<CommunityEntity[]> {
    return this.communityModel.find().exec();
  }

  async findCommunityById(id: string): Promise<CommunityEntity> {
    return this.communityModel.findById(id).exec();
  }
}
