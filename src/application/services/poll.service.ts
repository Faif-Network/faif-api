import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { PollEntity } from 'src/infrastructure/entities/poll.entity';
import { UserEntity } from 'src/infrastructure/entities/user.entity';
import { PollRepository } from 'src/infrastructure/repositories/poll.repository';
import { UserService } from './user.service';

@Injectable()
export class PollService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly userService: UserService
  ) {}

  async createPoll(poll: Partial<PollEntity>): Promise<PollEntity> {
    let attachment_url: string | null = null;
    let public_url: string | null = null;
    if (poll.attachment_type) {
      const blob_conn = process.env.AZURE_CONNECTION_STRING;
      if (!blob_conn) {
        throw new Error('Azure connection string is not defined');
      }

      const blob_service_client =
        BlobServiceClient.fromConnectionString(blob_conn);

      const container_client =
        blob_service_client.getContainerClient('attachments');
      const blob_name = `${new Date().valueOf()}-${poll.user_id}.${
        poll.attachment_type.split('/')[1]
      }`;
      const block_blob_client = container_client.getBlockBlobClient(blob_name);

      // Generate SAS token for the blob
      attachment_url = await block_blob_client.generateSasUrl({
        permissions: BlobSASPermissions.parse('racwd'),
        expiresOn: new Date(new Date().valueOf() + 86400),
        contentType: poll.attachment_type || 'application/octet-stream',
      });

      public_url = block_blob_client.url;
    }

    const data = await this.pollRepository.createPoll({
      ...poll,
      created_at: new Date().getTime(),
      attachment: poll.attachment_type ? public_url : null,
      num_likes: 0,
      deleted_at: null,
    });

    return {
      ...data,
      ...(attachment_url && { attachment_url }),
    };
  }

  async getPollById(id: string): Promise<PollEntity> {
    return await this.pollRepository.getPollById(id);
  }

  async getPollsByUserId(user_id: string): Promise<PollEntity[]> {
    return await this.pollRepository.getPollsByUserId(user_id);
  }

  async submitVote(poll_id: string, vote: { option: string; user_id: string }) {
    const user_voted = await this.pollRepository.hasUserVoted(
      poll_id,
      vote.user_id
    );
    if (user_voted) {
      await this.pollRepository.deleteVote(poll_id, vote.user_id);
    }
    return await this.pollRepository.submitVote(poll_id, vote);
  }

  async hasUserVoted(poll_id: string, user_id: string) {
    return await this.pollRepository.hasUserVoted(poll_id, user_id);
  }

  async deleteVote(poll_id: string, user_id: string): Promise<PollEntity> {
    return await this.pollRepository.deleteVote(poll_id, user_id);
  }

  async getPolls(populate?: string[]): Promise<any> {
    const polls = await this.pollRepository.getPolls();
    let usersPromise: Partial<UserEntity>[] | undefined;
    if (populate && populate.includes('user')) {
      const user_ids = new Set(polls.map((poll) => poll.user_id));
      usersPromise = await this.userService.searchUsers(Array.from(user_ids));
    }
    return polls.map((poll) => {
      const totalVotes = poll.votes.length;
      const pollWithPercentage = {
        is_poll: true,
        id: poll.id,
        question: poll.question,
        options: poll.options.map((option) => {
          const votes = poll.votes.filter((vote) => vote.option === option);
          return {
            option,
            percentage: totalVotes ? (votes.length / totalVotes) * 100 : 0,
          };
        }),
        attachment: poll.attachment,
        votes: poll.votes,
        created_at: poll.created_at,
        user: usersPromise?.find((user) => user.id === poll.user_id),
      };
      return pollWithPercentage;
    });
  }
}
