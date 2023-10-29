import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly authCodeRepository: Repository<AuthCode>,
  ) {}

  /** 사용자 생성
   * @Param username 사용자 계정이름
   * @Param email    사용자 이메일
   * @Param password 사용자 비밀번호, 해시 함수를 적용하고 저장 */
  async createUser({ username, email, password }) {
    const code: string = Math.floor(Math.random() * 1000000).toString();
    await this.authCodeRepository.save({
      username,
      code,
    });

    return await this.userRepository.save(
      this.userRepository.create({
        username,
        email,
        password,
      }),
    );
  }

  /** 비밀번호 유효성 검사
   * @Param password 사용자 비밀번호
   * @Param confirmPassword 사용자 비밀번호 확인 */
  async checkPasswordValidate(password: string, confirmPassword: string) {
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

    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    const comparePasswords = await bcrypt.compare(
      password,
      hashedConfirmPassword,
    );
    if (!comparePasswords) {
      throw new ConflictException(
        `비밀번호와 비밀번호 확인이 일치하지 않습니다.`,
      );
    }
  }

  /** 중복된 사용자 여부 확인
   * @Param username 사용자 계정이름 */
  async checkUserExists(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new ConflictException(`${username}은 이미 존재하는 계정입니다.`);
    }
  }
}
