import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunityEntity,
  CommunitySchema,
} from 'src/infrastructure/entities/community.entity';
import {
  ExplorerEntity,
  ExplorerSchema,
} from 'src/infrastructure/entities/explorer.entity';
import {
  UserEntity,
  UserSchema,
} from 'src/infrastructure/entities/user.entity';
import { CommunityRepository } from 'src/infrastructure/repositories/community.repository';
import { ExplorerRepository } from 'src/infrastructure/repositories/explorer.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { ExplorerController } from '../controllers/explorer.controller';
import { ExplorerService } from '../services/explorer.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExplorerEntity.name, schema: ExplorerSchema },
      { name: UserEntity.name, schema: UserSchema },
      { name: CommunityEntity.name, schema: CommunitySchema },
    ]),
  ],
  controllers: [ExplorerController],
  providers: [
    UserService,
    UserRepository,
    ExplorerRepository,
    ExplorerService,
    CommunityRepository,
  ],
  exports: [ExplorerService],
})
export class ExplorerModule {}
