import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';
import { FollowersService } from '../services/followers.service';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findFollowersAndFollowingNumber(@Req() req) {
    const { user_id } = req.user;
    const { filter } = req.query;
    const id = filter ? filter['user_id'] : user_id;
    const data = await this.followersService.findFollowersAndFollowingNumber(
      id,
      user_id ? user_id : null
    );
    return {
      message: 'Followers and following number retrieved successfully',
      data: data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFollower(@Req() req) {
    const { user_id } = req.user;
    const { follower_id } = req.body;
    return await this.followersService.createFollower(user_id, follower_id);
  }
}
