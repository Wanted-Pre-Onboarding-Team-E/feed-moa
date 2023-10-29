import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { ApproveMembershipRequestDto } from './dto/approveMembershipRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // @InjectRepository(AuthCode)
  ) // private readonly authCodeRepository: Repository<AuthCode>,
  {}

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
    /*
    const isRegistered = await this.authCodesRepository.findOneBy({
      username,
      code: authCode,
    });
    if (!isRegistered) {
      throw new UnauthorizedException('유효하지 않은 인증코드 입니다.');
    }

    await this.userRepository.update({ username }, { isActive: true });
    */
  }
}
