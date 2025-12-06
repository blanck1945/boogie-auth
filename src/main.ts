import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Por si en algún momento llamás algo vía fetch/XHR
  app.enableCors({
    origin: [
      'http://localhost:5173', // tu host frontend
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  });

  await app.listen(4001); // servicio de auth en 4001
}
bootstrap();
