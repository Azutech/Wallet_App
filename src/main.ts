import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpLogger } from './common/middleware/http-logger.middleware';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/app.response';

async function bootstrap() {
  const logger = new Logger('Wallet-Ops-V1');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT');
  app.setGlobalPrefix('api/v1');
  app.use(new HttpLogger().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.set('trust proxy', 1); // trust first proxy

  app.enableCors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true,
    maxAge: 3600,
  });

  // Port
  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
