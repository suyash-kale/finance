import { Module } from '@nestjs/common';

import { UsersService } from '@/users/users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@/database/database.module';
import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';
import { JwtService } from '@/utility/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, HashService, EncryptService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
