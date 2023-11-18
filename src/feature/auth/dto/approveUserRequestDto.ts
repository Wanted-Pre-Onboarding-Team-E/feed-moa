import { IsNumberString, IsString, Length } from 'class-validator';

export class ApproveUserRequestDto {
  @IsString()
  username!: string;

  @IsNumberString()
  @Length(6, 6)
  authCode!: string;
}
