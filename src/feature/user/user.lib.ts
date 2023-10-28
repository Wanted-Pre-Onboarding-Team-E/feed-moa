import { Injectable } from '@nestjs/common';

import { UserRepository } from './repository/user.repository';
import { User } from '../../entity/user.entity';

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
}
