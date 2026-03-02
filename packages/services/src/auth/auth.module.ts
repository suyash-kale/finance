import { Module } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { DatabaseModule } from '@/database/database.module';
import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';
import { JwtService } from '@/utility/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, HashService, EncryptService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
