import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from './repository/user.repository';
import { User } from '../../entity/user.entity';
import { LoginDto } from '../../auth/dto/login.dto';

@Injectable()
export class UserLib {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * id로 사용자 조회
   * @param id 사용자 DB id
   * @return User 객체
   */
  getUserById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  /**
   * 사용자 검증
   * @param username 사용자 계정 아이디
   * @param password 사용자 계정 비밀번호
   * @return 검증된 User 객체
   */
  async verifyUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findByUsername(loginDto.username);
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

  /**
   * 평문 비밀번호와 암호화된 비밀번호 비교
   * @param password 평문 비밀번호
   * @param hash 암호화된 비밀번호
   * @return 같으면 true, 다르면 false
   */
  // TODO: 별도 서비스(e.g. UtilService, AuthService...)로 분리
  comparePassword(password, hash): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
