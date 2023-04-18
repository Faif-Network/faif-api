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
      name: payload.name,
      email: payload.email,
      password: payload.password
    });
  }
  
}

interface CreateDTO {
  name: string;
  email: string;
  password: string;
}
