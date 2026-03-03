import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  if (configService.get<string>('NODE_ENV') === 'development') {
    app.enableCors();
  }
  app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') ?? '/service');
  await app.listen(configService.get<number>('PORT') ?? 8000);
}

bootstrap();
