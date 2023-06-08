import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PollEntity } from '../entities/poll.entity';

@Injectable()
export class PollRepository {
  constructor(
    @InjectModel(PollEntity.name)
    private readonly pollModel: Model<PollEntity>
  ) {}

  async getPolls(): Promise<PollEntity[]> {
    return await this.pollModel.find({}).exec();
  }

  async createPoll(poll: Partial<PollEntity>): Promise<PollEntity> {
    const id = new Types.ObjectId();
    const created_poll = new this.pollModel({
      ...poll,
      id: id.toString(),
      _id: id,
      created_at: new Date().getTime(),
      num_likes: 0,
      deleted_at: null,
    });

    return created_poll.save();
  }

  async getPollById(id: string): Promise<PollEntity> {
    return this.pollModel.findOne({ id });
  }

  async getPollsByUserId(user_id: string): Promise<PollEntity[]> {
    return this.pollModel.find({ user_id });
  }

  async submitVote(
    poll_id: string,
    vote: { option: string; user_id: string }
  ): Promise<PollEntity> {
    const poll = await this.pollModel.findOne({ id: poll_id });
    poll.votes.push(vote);
    return poll.save();
  }

  async hasUserVoted(
    poll_id: string,
    user_id: string
  ): Promise<{ has_voted: boolean; option: string }> {
    const poll = await this.pollModel.findOne({ id: poll_id });
    const vote = poll.votes.find((vote) => vote.user_id === user_id);
    return {
      has_voted: !!vote,
      option: vote ? vote.option : null,
    };
  }

  async deleteVote(poll_id: string, user_id: string): Promise<PollEntity> {
    const poll = await this.pollModel.findOne({ id: poll_id });
    poll.votes = poll.votes.filter((vote) => vote.user_id !== user_id);
    return poll.save();
  }
}
