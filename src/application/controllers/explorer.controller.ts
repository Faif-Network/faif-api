import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';
import { ExplorerService } from '../services/explorer.service';

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Get()
  async searchExplorersByExplorerType(@Req() req) {
    const { filter } = req.query;

    const explorers = await this.explorerService.searchExplorersByExplorerType(
      filter ? filter : undefined
    );
    return {
      message: 'Explorers retrieved successfully',
      data: explorers,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExplorer(@Body() body: CreateExplorerDTO, @Req() req) {
    const user_id = req.user.user_id;

    if (!body.title || !body.description || !body.short_description) {
      throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
    }

    const data = await this.explorerService.create({
      user_id: user_id,
      title: body.title,
      description: body.description,
      short_description: body.short_description,
      start_date: body.start_date,
      explorer_type: body.explorer_type,
    });

    return {
      message: 'Explorer created successfully',
      data: {
        id: data.id,
        attachment_url: data.attachment_url,
      },
    };
  }
}

interface CreateExplorerDTO {
  user_id: string;
  title: string;
  description: string;
  short_description: string;
  start_date: number;
  explorer_type: string;
}
