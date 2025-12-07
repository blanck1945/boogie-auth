import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Por si en algún momento llamás algo vía fetch/XHR
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(4001); // servicio de auth en 4001
}
bootstrap();
