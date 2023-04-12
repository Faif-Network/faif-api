import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async login(user: LoginDTO): Promise<{ access_token: string }> {
    const user_exists = await this.userService.findByEmail(user.email);
    if (!user_exists) {
      throw new Error("User not found");
    }

    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}

interface LoginDTO {
  email: string;
  password: string;
}
