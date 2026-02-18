import { Inject, Injectable } from '@nestjs/common';
import { count, eq, or } from 'drizzle-orm';
import { validate } from 'class-validator';

import { DRIZZLE, type DrizzleDB, schema } from '@/database/database.module';
import { SignUpRequest, UserType } from '@/types/user';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';
import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    @Inject(HashService) private hash: HashService,
    @Inject(EncryptService) private encrypt: EncryptService,
  ) {}

  async signUp(request: SignUpRequest): Promise<UserType> {
    // validate the request data
    if ((await validate(request)).length > 0) {
      throw new ServiceError(ServiceErrorCodes.VALIDATION, 'Invalid user data');
    }
    // check if user with the same email or mobile already exists
    const email = await this.encrypt.encrypt(request.email);
    const [exist] = await this.db
      .select({ count: count() })
      .from(schema.Users)
      .where(or(eq(schema.Users.email, email)));
    if (exist.count > 0) {
      throw new ServiceError(
        ServiceErrorCodes.EXISTS,
        'User already registered.',
      );
    }
    // create the user
    const [user] = await this.db
      .insert(schema.Users)
      .values({
        fname: request.fname,
        lname: request.lname,
        email,
        password: await this.hash.hash(request.password),
      })
      .returning({
        user_id: schema.Users.user_id,
        fname: schema.Users.fname,
        lname: schema.Users.lname,
        email: schema.Users.email,
      });
    return user;
  }
}
