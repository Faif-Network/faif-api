import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExplorerEntity } from '../entities/explorer.entity';

@Injectable()
export class ExplorerRepository {
  constructor(
    @InjectModel(ExplorerEntity.name)
    private readonly explorerModel: Model<ExplorerEntity>
  ) {}

  async searchExplorersByExplorerType(
    explorer_type: string
  ): Promise<ExplorerEntity[]> {
    if (explorer_type) {
      return this.explorerModel
        .find({
          deleted_at: null,
          explorer_type: explorer_type.toUpperCase(),
        })
        .sort({ created_at: -1 })
        .exec();
    } else {
      return this.explorerModel
        .find({
          deleted_at: null,
        })
        .sort({ created_at: -1 })
        .exec();
    }
  }

  async createExplorer(
    user_id: string,
    title: string,
    description: string,
    short_description: string,
    attachment: string,
    start_date: number,
    explorer_type: string
  ): Promise<ExplorerEntity> {
    const explorer_id = new Types.ObjectId();
    const created_explorer = new this.explorerModel({
      _id: explorer_id,
      id: explorer_id.toString(),
      user_id,
      title,
      description,
      short_description,
      attachment,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      start_date,
      explorer_type,
    });
    return created_explorer.save();
  }
}
