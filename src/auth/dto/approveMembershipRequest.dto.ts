import { IsNumberString, IsString, Length } from 'class-validator';

export class ApproveMembershipRequestDto {
  @IsString()
  username!: string;

  @IsNumberString()
  @Length(6, 6)
  authCode!: string;
}
