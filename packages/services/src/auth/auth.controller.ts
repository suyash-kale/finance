import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import {
  SignInRequest,
  SignUpRequest,
  type UserSessionType,
  UserType,
} from '@root/database/types';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';
import { Auth } from '@/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() request: SignUpRequest): Promise<UserType> {
    try {
      return await this.authService.signUp(request);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.code === ServiceErrorCodes.EXISTS) {
          throw new BadRequestException(e.message);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  @Post()
  async signIn(@Body() request: SignInRequest): Promise<UserType> {
    try {
      return await this.authService.signIn(request);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.code === ServiceErrorCodes.NOTFOUND) {
          throw new BadRequestException(e.message);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @Auth()
  async me(@CurrentUser() user: UserSessionType) {
    return await this.authService.me(user);
  }

  @Post('email-exists')
  async emailExists(@Body('email') email: string): Promise<boolean> {
    return await this.authService.emailExists(email);
  }
}
