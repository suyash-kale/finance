import { Inject, Injectable } from '@nestjs/common';
import { count, eq, or } from 'drizzle-orm';
import { validate } from 'class-validator';

import { DRIZZLE, type DrizzleDB, schema } from '@/database/database.module';
import { SignInRequest, SignUpRequest, UserSessionType } from '@/types/user';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';
import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';
import { JwtService } from '@/utility/jwt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    @Inject(HashService) private hash: HashService,
    @Inject(EncryptService) private encrypt: EncryptService,
    @Inject(JwtService) private jwt: JwtService,
  ) {}

  async signUp(request: SignUpRequest): Promise<UserSessionType> {
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
        fname: schema.Users.fname,
        lname: schema.Users.lname,
        email: schema.Users.email,
      });
    return {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      token: this.jwt.encode({ user_id: user.email }),
    };
  }

  async signIn(request: SignInRequest): Promise<UserSessionType> {
    // validate the request data
    if ((await validate(request)).length > 0) {
      throw new ServiceError(
        ServiceErrorCodes.VALIDATION,
        'Invalid user data.',
      );
    }
    // find the user by email
    const [user] = await this.db
      .select({
        fname: schema.Users.fname,
        lname: schema.Users.lname,
        email: schema.Users.email,
        password: schema.Users.password,
      })
      .from(schema.Users)
      .where(
        or(eq(schema.Users.email, await this.encrypt.encrypt(request.email))),
      );
    // if user not found
    if (!user) {
      throw new ServiceError(
        ServiceErrorCodes.NOTFOUND,
        'Invalid email or password.',
      );
    }
    // compare the password
    if (await this.hash.compare(request.password, user.password)) {
      return {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        token: this.jwt.encode({ user_id: user.email }),
      };
    }
    // if password does not match
    throw new ServiceError(
      ServiceErrorCodes.NOTFOUND,
      'Invalid email or password.',
    );
  }
}
