import { Module } from '@nestjs/common';

import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';
import { JwtService } from '@/utility/jwt';

@Module({
  providers: [HashService, EncryptService, JwtService],
  exports: [HashService, EncryptService, JwtService],
})
export class UtilityModule {}
