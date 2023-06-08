import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExplorerEntity } from 'src/infrastructure/entities/explorer.entity';
import { ExplorerRepository } from 'src/infrastructure/repositories/explorer.repository';
import { UserService } from './user.service';

@Injectable()
export class ExplorerService {
  constructor(
    private readonly explorerRepository: ExplorerRepository,
    private readonly userService: UserService
  ) {}

  async create(payload: CreateDTO): Promise<any> {
    const user = await this.userService.findById(payload.user_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const blob_conn = process.env.AZURE_CONNECTION_STRING;
    if (!blob_conn) {
      throw new Error('Azure connection string is not defined');
    }

    const blob_service_client =
      BlobServiceClient.fromConnectionString(blob_conn);

    const container_client =
      blob_service_client.getContainerClient('attachments');
    const blob_name = `${new Date().valueOf()}-${payload.user_id}.jpeg`;
    const block_blob_client = container_client.getBlockBlobClient(blob_name);

    // Generate SAS token for the blob
    const attachment_url = await block_blob_client.generateSasUrl({
      permissions: BlobSASPermissions.parse('racwd'),
      expiresOn: new Date(new Date().valueOf() + 86400),
      contentType: 'image/jpeg',
    });

    const public_url = block_blob_client.url;

    const explorer = await this.explorerRepository.createExplorer(
      payload.user_id,
      payload.title,
      payload.description,
      payload.short_description,
      public_url,
      payload.start_date,
      payload.explorer_type
    );

    return {
      id: explorer.id,
      attachment_url,
    };
  }

  async searchExplorersByExplorerType(
    explorer_type: string
  ): Promise<ExplorerEntity[]> {
    return this.explorerRepository.searchExplorersByExplorerType(
      explorer_type['type']
    );
  }
}

interface CreateDTO {
  user_id: string;
  title: string;
  description: string;
  short_description: string;
  start_date: number;
  explorer_type: string;
}
