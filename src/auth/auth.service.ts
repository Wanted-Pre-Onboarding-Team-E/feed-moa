import { Injectable } from '@nestjs/common';
import { CreateAuthCodeDto } from '../feature/user/dto/createAuthCode.dto';
import { AuthCodeRepository } from './repository/authCode.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authCodeRepository: AuthCodeRepository) {}

  async createAuthCode(email: string) {
    const code: string = Math.floor(Math.random() * 1000000).toString();

    console.log(code);
    return await this.authCodeRepository.save(
      this.authCodeRepository.create({
        email,
        code,
      }) as CreateAuthCodeDto,
    );
  }
}
