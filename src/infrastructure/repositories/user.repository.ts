import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<UserEntity | null>;
  findOneById(id: ObjectId): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: ObjectId): Promise<UserEntity | null> {
    return this.userModel.findById(id).exec();
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const createdUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      last_name: null
    });
    return createdUser.save();
  }
}
