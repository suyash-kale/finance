import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: never, content: ExecutionContext) => {
    const request: Request = content.switchToHttp().getRequest();
    return request.user;
  },
);
