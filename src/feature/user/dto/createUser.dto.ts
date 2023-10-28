import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  //@IsStrongPassword()
  @IsString()
  @MinLength(10)
  password!: string;
}
