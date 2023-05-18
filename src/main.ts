import * as dotenv from 'dotenv';
import { createApp } from './main.azure';

async function bootstrap() {
  dotenv.config();
  const app = await createApp();
  await app.listen(3000);
}
bootstrap();
