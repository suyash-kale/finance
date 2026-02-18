import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType as User } from '@/database/schema/users.schema';

export type UserType = Pick<User, 'user_id' | 'fname' | 'lname' | 'email'>;

export class SignUpRequest implements Pick<
  User,
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
