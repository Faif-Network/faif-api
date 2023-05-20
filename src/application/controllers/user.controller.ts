import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { IUserAuth, JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: UpdateControllerDTO, @Req() req) {
    const { user_id } = req.user as IUserAuth;
    const { name, last_name, username, email } = body;

    await this.userService.update(user_id, {
      name,
      last_name,
    });
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
}

interface UpdateControllerDTO {
  username: string;
  name: string;
  last_name: string;
  email: string;
}
