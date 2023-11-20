import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { AuthCode } from '../../entity/authCode.entity';
import { User } from '../../entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { ApproveMembershipRequestDto } from './dto/approveMembershipRequest.dto';
import { ErrorType } from '../../enum/errorType.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthCode)
    private readonly authCodeRepository: Repository<AuthCode>,
    private readonly dataSource: DataSource,
  ) {}

  /** 사용자 생성
   * @param username 사용자 계정이름
   * @param email    사용자 이메일
   * @param password 사용자 비밀번호, 해시 함수를 적용하고 저장 */
  async createUser({ username, email, password }) {
    const code: string = Math.floor(Math.random() * 1000000).toString();
    const savedAuthCode = await this.authCodeRepository.save({
      username,
      code,
    });

    await this.userRepository.save(
      this.userRepository.create({
        username,
        email,
        password,
      }),
    );
    return savedAuthCode.code;
  }

  /** 비밀번호 유효성 검사
   * @param password 사용자 비밀번호
   * @param confirmPassword 사용자 비밀번호 확인 */
  async checkPasswordValidate(password: string, confirmPassword: string) {
    const characterTypes = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;
    if (characterTypes < 2) {
      throw new BadRequestException(ErrorType.PASSWORD_CHARACTER_REQUIRE);
    }

    if (/([!@#$%^&*()+\-=\[\]{}|;:'",.<>/?\w])\1\1/.test(password)) {
      throw new BadRequestException(ErrorType.PASSWORD_DISALLOW_CONSECUTIVE);
    }

    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    const comparePasswords = await this.comparePassword(
      password,
      hashedConfirmPassword,
    );

    if (!comparePasswords) {
      throw new ConflictException(ErrorType.PASSWORD_CONFIRM_MISMATCH);
    }
  }

  /** 중복된 사용자 여부 확인
   * @param username 사용자 계정이름 */
  async checkUserExists(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      throw new ConflictException(`${username}은 ${ErrorType.USER_EXIST}`);
    }
  }

  /**
   * 사용자 검증
   * @return 검증된 User 객체
   * @param loginDto LoginDto
   */
  async verifyUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findOneBy({
      username: loginDto.username,
    });
    if (!user) {
      throw new UnauthorizedException(ErrorType.USER_NOT_EXIST);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ErrorType.USER_NOT_APPROVE);
    }

    const isMatch = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException(ErrorType.PASSWORD_MISMATCH);
    }

    return user;
  }

  comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async activateUser({ username, authCode }: ApproveMembershipRequestDto) {
    // 발급된 인증코드가 있는지 확인
    const foundAuthCode = await this.authCodeRepository.findOneBy({
      username,
      code: authCode,
    });
    if (!foundAuthCode) {
      throw new UnauthorizedException(ErrorType.AUTH_CODE_INVALID);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // 1. User의 isActive: false -> true로 변경
      await queryRunner.manager
        .getRepository(User)
        .update({ username }, { isActive: true });
      // 2. 발급된 인증코드 삭제
      await queryRunner.manager.getRepository(AuthCode).remove(foundAuthCode);

      // COMMIT
      await queryRunner.commitTransaction();
    } catch (err) {
      // ROLLBACK
      await queryRunner.rollbackTransaction();
    }
  }
}
