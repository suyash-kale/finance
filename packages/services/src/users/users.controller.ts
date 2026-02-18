import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { UsersService } from '@/users/users.service';
import { SignUpRequest, UserType } from '@/types/user';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(@Body() request: SignUpRequest): Promise<UserType | undefined> {
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
}
