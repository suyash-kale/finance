import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (request.user?.user_id) {
      return true;
    }
    return false;
  }
}

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}
