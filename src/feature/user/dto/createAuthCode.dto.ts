import { IsEmail, IsString } from 'class-validator';

export class CreateAuthCodeDto {
  @IsEmail()
  email!: string;

  @IsString()
  code!: string;
}
