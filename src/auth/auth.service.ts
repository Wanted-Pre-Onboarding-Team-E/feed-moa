import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCode } from '../entity/authCode.entity';
import { User } from '../entity/user.entity';
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
