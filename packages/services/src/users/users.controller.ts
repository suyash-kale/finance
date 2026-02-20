import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { UsersService } from '@/users/users.service';
import {
  SignInRequest,
  SignUpRequest,
  type UserSessionType,
  UserType,
} from '@/types/user';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';
import { Auth } from '@/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(@Body() request: SignUpRequest): Promise<UserType> {
    try {
      return await this.usersService.signUp(request);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.code === ServiceErrorCodes.EXISTS) {
          throw new BadRequestException(e.message);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('signin')
  async signIn(@Body() request: SignInRequest): Promise<UserType> {
    try {
      return await this.usersService.signIn(request);
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
    return await this.usersService.me(user);
  }
}
