import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/users/users.module';
import { CurrentUserMiddleware } from '@/middlewares/current-user.middleware';
import { UtilityModule } from '@/utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UtilityModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
