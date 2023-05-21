import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req) {
    const { user_id } = req.user;
    const user = await this.userService.findMe(user_id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Get('/:user_id')
  @UseGuards(JwtAuthGuard)
  async findById(@Req() req) {
    const { user_id } = req.params;
    const user = await this.userService.findById(user_id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() body) {
    const { user_id } = req.user;
    const { username, name, last_name, avatar, biography } = body;
    const user = await this.userService.update(user_id, {
      username,
      name,
      last_name,
      avatar,
      biography,
    });
    return {
      message: 'User updated successfully',
      data: user,
    };
  }
}
