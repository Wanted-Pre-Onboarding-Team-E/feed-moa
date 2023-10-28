import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entity/user.entity';

@Injectable()
export class UserLib {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * id로 사용자 조회
   * @param id 사용자 DB id
   * @return User 객체
   */
  getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
