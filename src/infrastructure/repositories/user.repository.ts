import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<UserEntity | null>;
  findOneById(id: string): Promise<UserEntity | null>;
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

  async findOneById(id: string): Promise<UserEntity | null> {
    return this.userModel.findById(
      new Types.ObjectId(id)
    ).exec();
  }

  async searchUsers(user_ids: string[]): Promise<UserEntity[]> {
    return this.userModel.find({
      id: {
        $in: user_ids
      }
    }).exec();
  }
  
  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const user_id = new Types.ObjectId();
    const createdUser = new this.userModel({
      _id: user_id,
      id: user_id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    });
    return createdUser.save();
  }

  async update(user: Partial<UserEntity>): Promise<void> {
    await this.userModel.findByIdAndUpdate({
      id: user.id,
    }, {
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      username: user.username
    })
  }
}
