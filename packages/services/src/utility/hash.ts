import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private salt: number;

  constructor(private configService: ConfigService) {
    this.salt = Number(this.configService.get<number>('HASH_SALT') || 10);
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
