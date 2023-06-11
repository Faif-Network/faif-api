import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(user: LoginDTO): Promise<{ access_token: string }> {
    const user_exists = await this.userService.findByEmail(user.email);
    if (!user_exists) {
      throw new HttpException('User not found', 404);
    }

    const password_matches = await bcrypt.compare(
      user.password,
      user_exists.password
    );
    if (!password_matches) {
      Logger.error('Invalid credentials');
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = {
      email: user_exists.email,
      username: user_exists.username,
      user_id: user_exists.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(payload: RegisterDTO) {
    const { username, email, password } = payload;
    const user_exists = await this.userService.findByEmail(email);
    if (user_exists) {
      Logger.error('User already exists');
      throw new HttpException('User already exists', 400);
    }

    const password_hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      username,
      email,
      password: password_hashed,
    });

    const blob_connn = process.env.AZURE_CONNECTION_STRING;
    if (!blob_connn) throw new Error('No blob connection string');
    const blob_service_client =
      BlobServiceClient.fromConnectionString(blob_connn);

    const container_client = blob_service_client.getContainerClient('avatars');
    const blob_name = `${user.id}.jpg`;
    const blob_client = container_client.getBlockBlobClient(blob_name);
    const sas_token = await blob_client.generateSasUrl({
      permissions: BlobSASPermissions.parse('racwd'),
      expiresOn: new Date(new Date().valueOf() + 86400),
    });

    return {
      id: user.id,
      avatar_upload_url: sas_token,
      username: user.username,
      acces_token: this.jwtService.sign({
        email: user.email,
        username: user.username,
        user_id: user.id,
      }),
    };
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
