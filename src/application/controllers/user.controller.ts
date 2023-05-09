import { Body, Controller, Put, Req, UseGuards } from "@nestjs/common";
import { IUserAuth, JwtAuthGuard } from "../../shared/jwt-auth.guard";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @Put("/me")
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: UpdateControllerDTO, @Req() req) {
    const { user_id } = req.user as IUserAuth
    const { name, last_name, username, email } = body

    await this.userService.update(user_id, {
      name,
      last_name
    })
    
  }

}

interface UpdateControllerDTO {
  username: string;
  name: string;
  last_name: string;
  email: string;
}