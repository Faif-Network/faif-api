import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginControllerDTO) {
    const { email, password } = body;

    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const { access_token } = await this.authService.login(body);
    return {
      message: 'Login successful',
      data: {
        access_token,
      },
    };
  }

  @Post('/register')
  async register(@Body() body: RegisterControllerDTO) {
    const { username, email, password } = body;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.authService.register(body);
    return {
      message: 'User created successfully',
      data: {
        avatar: user.avatar_upload_url,
        user_id: user.id,
        username: user.username,
        access_token: user.acces_token,
      },
    };
  }
}

interface LoginControllerDTO {
  email: string;
  password: string;
}

interface RegisterControllerDTO {
  username: string;
  email: string;
  password: string;
}
