import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  @Post("/login")
  async login(@Body() body: any): Promise<{ access_token: string }> {
    const { access_token } = await this.authService.login(body);
    return { access_token };
  }
}

