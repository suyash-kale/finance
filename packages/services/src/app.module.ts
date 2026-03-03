import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { CurrentUserMiddleware } from '@/middlewares/current-user.middleware';
import { UtilityModule } from '@/utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 1000 * 60 * 60, // 60 minutes
    }),
    DatabaseModule,
    UtilityModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
