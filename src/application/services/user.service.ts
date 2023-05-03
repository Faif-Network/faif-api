import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/infrastructure/entities/user.entity";
import { UserRepository } from "src/infrastructure/repositories/user.repository";

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
