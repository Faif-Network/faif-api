import { HttpException, Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { CommunityRepository } from '../../infrastructure/repositories/community.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly communityRepository: CommunityRepository
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async findMe(user_id: string): Promise<Partial<UserEntity> | null> {
    const user = await this.userRepository.findOneById(user_id);
    const community = await this.communityRepository.findCommunityById(
      user?.community_id
    );
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      last_name: user.last_name,
      avatar: user.avatar,
      biography: user.biography,
      community_id: user.community_id,
      community: {
        id: community?.id,
        name: community?.name,
        slug: community?.slug,
        icon: community?.icon,
      },
    };
  }

  async findById(user_id: string): Promise<Partial<UserEntity> | null> {
    const user = await this.userRepository.findOneById(user_id);
    const community = await this.communityRepository.findCommunityById(
      user?.community_id
    );
    return {
      username: user.username,
      name: user.name,
      last_name: user.last_name,
      avatar: user.avatar,
      biography: user.biography,
      community_id: user.community_id,
      community: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        icon: community.icon,
      },
    };
  }

  async create(payload: CreateDTO): Promise<UserEntity> {
    return this.userRepository.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
  }

  async searchUsers(user_ids: string[]): Promise<Partial<UserEntity>[]> {
    const users = await this.userRepository.searchUsers(user_ids);
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    }));
  }

  async update(user_id: string, payload: UpdateDTO): Promise<void> {
    const user = this.userRepository.findOneById(user_id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.userRepository.update(user_id, payload);
  }
}

interface CreateDTO {
  username: string;
  email: string;
  password: string;
}

interface UpdateDTO {
  username?: string;
  name?: string;
  last_name?: string;
  email?: string;
  biography?: string;
  avatar?: string;
  community_id?: string;
}
