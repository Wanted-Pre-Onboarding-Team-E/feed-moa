import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  @MinLength(10)
  password!: string;

  @IsString()
  confirmPassword!: string;
}
