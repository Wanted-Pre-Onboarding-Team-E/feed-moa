import { IsString } from 'class-validator';

export class CreateAuthCodeDto {
  @IsString()
  username!: string;

  @IsString()
  code!: string;
}
