import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { AuthCodeRepository } from '../../auth/repository/authCode.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCodeRepository: AuthCodeRepository,
  ) {}

  async createUser({ username, email, password }) {
    const code: string = Math.floor(Math.random() * 1000000).toString();
    await this.authCodeRepository.save({
      username,
      code,
    });

    return await this.userRepository.save({
      username,
      email,
      password,
    });
  }

  async checkPasswordValidate(password: string) {
    const characterTypes = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;

    if (characterTypes < 2) {
      throw new ConflictException(
        `비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야하 합니다.`,
      );
    }

    if (/(\w)\1\1/.test(password)) {
      throw new ConflictException(
        `비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.`,
      );
    }
  }

  async checkUserExists(username: string) {
    const user = this.userRepository.findOneByUsername(username);

    if (user) {
      throw new ConflictException(`${username}은 이미 존재하는 계정입니다.`);
    }
  }
}
