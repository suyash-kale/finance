import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private secret: string;
  // 24 hours
  private expiresIn: number = 60 * 60 * 24;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET') || 'JWT-SECRET';
  }

  encode(o: Record<string, unknown>): string {
    return jwt.sign(o, this.secret, { expiresIn: this.expiresIn });
  }

  async decode<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(token, this.secret, (err, decoded) => {
          if (err) {
            reject(new Error('Invalid token'));
          } else {
            resolve(decoded as T);
          }
        });
      } catch {
        reject(new Error('Invalid token'));
      }
    });
  }
}
