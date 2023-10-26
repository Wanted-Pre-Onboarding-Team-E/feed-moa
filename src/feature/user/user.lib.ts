import { Injectable } from '@nestjs/common';

import { UserRepository } from './repository/user.repository';
import { User } from '../../entity/user.entity';

@Injectable()
export class UserLib {
  constructor(private readonly userRepository: UserRepository) {}

  getById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }
}
