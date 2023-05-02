import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from "./jwt.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    if (!payload) {
      return null;
    }

    return { user_id: payload.user_id, username: payload.username, email: payload.email };
  }
}

interface JwtPayload {
  user_id: string;
  email: string;
  username: string;
}
