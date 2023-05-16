import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../infrastructure/entities/user.entity";
import { UserRepository } from "../../infrastructure/repositories/user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(payload: CreateDTO): Promise<UserEntity> {
    return this.userRepository.create({
      username: payload.username,
      email: payload.email,
      password: payload.password
    });
  }

  async searchUsers(user_ids: string[]): Promise<Partial<UserEntity>[]> {
    const users = await this.userRepository.searchUsers(user_ids);
    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    }));
  }

  async update(user_id: string, payload: UpdateDTO): Promise<void>{
    const user = this.userRepository.findOneById(user_id)
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
}
