import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserSchemaType } from '@/database/schema/users.schema';

export type UserSessionType = Pick<UserSchemaType, 'user_id'> & {
  token: string;
};

export type UserType = Pick<UserSchemaType, 'fname' | 'lname' | 'email'> & {
  token: string;
};

export class SignUpRequest implements Pick<
  UserSchemaType,
  'fname' | 'lname' | 'email' | 'password'
> {
  @IsNotEmpty()
  @IsString()
  fname: string;

  @IsNotEmpty()
  @IsString()
  lname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SignInRequest implements Pick<
  UserSchemaType,
  'email' | 'password'
> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
