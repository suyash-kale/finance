import { Inject, Injectable } from '@nestjs/common';
import { count, eq, or } from 'drizzle-orm';
import { validate } from 'class-validator';

import { DRIZZLE, type DrizzleDB, Schema } from '@/database/database.module';
import {
  SignInRequest,
  SignUpRequest,
  UserSessionType,
  UserType,
} from '@root/database/types';
import { ServiceError, ServiceErrorCodes } from '@/utility/error';
import { HashService } from '@/utility/hash';
import { EncryptService } from '@/utility/encrypt';
import { JwtService } from '@/utility/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    @Inject(HashService) private hash: HashService,
    @Inject(EncryptService) private encrypt: EncryptService,
    @Inject(JwtService) private jwt: JwtService,
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
      .from(Schema.Users)
      .where(or(eq(Schema.Users.email, email)));
    if (exist.count > 0) {
      throw new ServiceError(
        ServiceErrorCodes.EXISTS,
        'User already registered.',
      );
    }
    // create the user
    const [user] = await this.db
      .insert(Schema.Users)
      .values({
        fname: request.fname,
        lname: request.lname,
        email,
        password: await this.hash.hash(request.password),
      })
      .returning({
        fname: Schema.Users.fname,
        lname: Schema.Users.lname,
        email: Schema.Users.email,
      });
    return {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      token: this.jwt.encode({ user_id: user.email }),
    };
  }

  async signIn(request: SignInRequest): Promise<UserType> {
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
        user_id: Schema.Users.user_id,
        fname: Schema.Users.fname,
        lname: Schema.Users.lname,
        email: Schema.Users.email,
        password: Schema.Users.password,
      })
      .from(Schema.Users)
      .where(
        or(eq(Schema.Users.email, await this.encrypt.encrypt(request.email))),
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
        email: await this.encrypt.decrypt(user.email),
        token: this.jwt.encode({ user_id: user.user_id }),
      };
    }
    // if password does not match
    throw new ServiceError(
      ServiceErrorCodes.NOTFOUND,
      'Invalid email or password.',
    );
  }

  async me(session: UserSessionType): Promise<UserType> {
    const [user] = await this.db

      .select({
        fname: Schema.Users.fname,
        lname: Schema.Users.lname,
        email: Schema.Users.email,
      })
      .from(Schema.Users)
      .where(eq(Schema.Users.user_id, session.user_id));
    if (!user) {
      throw new ServiceError(ServiceErrorCodes.NOTFOUND, 'User not found.');
    }
    return {
      fname: user.fname,
      lname: user.lname,
      email: await this.encrypt.decrypt(user.email),
      token: session.token,
    };
  }
}
