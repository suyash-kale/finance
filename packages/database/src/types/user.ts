import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export interface UserSessionType {
  user_id: number;
  token: string;
}

export interface UserType {
  fname: string;
  lname?: null | string;
  email: string;
  token: string;
}

export class SignUpRequest {
  @IsNotEmpty()
  @IsString()
  fname: string;

  @IsNotEmpty()
  @IsString()
  lname?: null | string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SignInRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
