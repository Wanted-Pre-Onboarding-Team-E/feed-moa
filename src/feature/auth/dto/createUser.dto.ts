import { IsEmail, IsString, MinLength } from 'class-validator';
import { ErrorType } from '../../../enum/errorType.enum';

export class CreateUserDto {
  @IsEmail({}, { message: ErrorType.EMAIL_NOT_VALID })
  email!: string;

  @IsString()
  username!: string;

  @IsString({ message: ErrorType.PASSWORD_LENGTH_REQUIRE })
  @MinLength(10)
  password!: string;

  @IsString()
  confirmPassword!: string;
}
