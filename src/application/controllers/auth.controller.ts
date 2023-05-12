import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  @Post("/login")
  async login(@Body() body: LoginControllerDTO){
    const { email, password } = body;

    if (!email) {
      throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
    }

    const { access_token } = await this.authService.login(body);
    return { 
      data: {
        access_token 
      }
     };
  }

  @Post("/register")
  async register(@Body() body: RegisterControllerDTO) {
    const { username, email, password } = body;

    if (!username) {
      throw new HttpException("Username is required", HttpStatus.BAD_REQUEST);
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
  username: string;
  email: string;
  password: string;
}

