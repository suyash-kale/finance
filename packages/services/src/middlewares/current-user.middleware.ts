import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { UserSessionType } from '@/types/user';
import { JwtService } from '@/utility/jwt';

declare module 'express' {
  interface Request {
    user?: UserSessionType;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorization = req.headers['authorization'];
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const user = await this.jwt.decode<UserSessionType>(token);
      req.user = { ...user, token };
    }
    next();
  }
}
