import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

@Injectable()
export class EncryptService {
  private iv: string;
  private password: string;
  private salt: number = 32;

  constructor(private configService: ConfigService) {
    this.iv =
      this.configService.get<string>('ENCRYPTION_IV') || 'ENCRYPTION_PASSWORD';
    if (!this.iv) {
      throw new Error('ENCRYPTION_IV is not defined in environment variables');
    }

    this.password =
      this.configService.get<string>('ENCRYPTION_PASSWORD') ||
      'ENCRYPTION-PASSWORD';
    if (!this.password) {
      throw new Error(
        'ENCRYPTION_PASSWORD is not defined in environment variables',
      );
    }
  }

  async encrypt(text: string): Promise<string> {
    const iv = Buffer.from(this.iv, 'base64');

    const key = (await promisify(scrypt)(
      this.password,
      'salt',
      this.salt,
    )) as Buffer;

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString('base64') + ':' + encryptedText.toString('base64');
  }

  async decrypt(encryptedData: string): Promise<string> {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'base64');
    const encryptedText = Buffer.from(parts[1], 'base64');

    const key = (await promisify(scrypt)(
      this.password,
      'salt',
      this.salt,
    )) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }
}
