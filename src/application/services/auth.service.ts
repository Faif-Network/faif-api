import { HttpException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
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
      throw new HttpException("User not found", 404);
    }

    const password_matches = await bcrypt.compare(user.password, user_exists.password);
    if (!password_matches) {
      Logger.error("Invalid credentials")
      throw new HttpException("Invalid credentials", 400);
    }
    
    const payload = { email: user_exists.email, username: user_exists.username, user_id: user_exists.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async register(payload: RegisterDTO) {
    const { username, email, password } = payload;
    const user_exists = await this.userService.findByEmail(email);
    if (user_exists) {
      Logger.error("User already exists")
      throw new HttpException("User already exists", 400);
    }

    const password_hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ username, email, password: password_hashed });
    return user;
  }
}

interface LoginDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}
