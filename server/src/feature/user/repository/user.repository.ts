import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {}
