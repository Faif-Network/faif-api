import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  @Post("/login")
  async login(@Body() body: LoginControllerDTO): Promise<{ access_token: string }> {
    const { email, password } = body;

    if (!email) {
      throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
    }

    const { access_token } = await this.authService.login(body);
    return { access_token };
  }

  @Post("/register")
  async register(@Body() body: RegisterControllerDTO) {
    const { name, email, password } = body;

    if (!name) {
      throw new HttpException("Name is required", HttpStatus.BAD_REQUEST);
    }

    if (!email) {
      throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
    }

    return this.authService.register(body);
  }
}

interface LoginControllerDTO {
  email: string;
  password: string;
}

interface RegisterControllerDTO {
  name: string;
  email: string;
  password: string;
}

