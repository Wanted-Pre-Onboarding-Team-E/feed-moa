import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User> {
    return this.repository.findOneBy({ username });
  }

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }
}
