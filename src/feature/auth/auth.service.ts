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
   * @Param username 사용자 계정이름
   * @Param email    사용자 이메일
   * @Param password 사용자 비밀번호, 해시 함수를 적용하고 저장 */
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
   * @Param password 사용자 비밀번호
   * @Param confirmPassword 사용자 비밀번호 확인 */
  async checkPasswordValidate(password: string, confirmPassword: string) {
    const characterTypes = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;
    if (characterTypes < 2) {
      throw new BadRequestException(
        `비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야하 합니다.`,
      );
    }

    if (/([!@#$%^&*()+\-=\[\]{}|;:'",.<>/?\w])\1\1/.test(password)) {
      throw new BadRequestException(
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
      throw new UnauthorizedException('존재하지 않는 아이디입니다.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('가입 승인되지 않은 사용자입니다.');
    }

    const isMatch = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async activateUser({ username, authCode }: ApproveMembershipRequestDto) {
    // 발급된 인증코드가 있는지 확인
    const foundAuthCode = await this.authCodeRepository.findOneBy({
      username,
      code: authCode,
    });
    if (!foundAuthCode) {
      throw new UnauthorizedException('유효하지 않은 인증코드 입니다.');
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
