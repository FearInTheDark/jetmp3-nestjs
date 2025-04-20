import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
    transform: true,
    whitelist: true,
  }))
  app.setGlobalPrefix('api');
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then();