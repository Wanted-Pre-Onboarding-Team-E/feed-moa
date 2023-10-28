import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCode } from '../../entity/authCode.entity';

@Injectable()
export class AuthCodeRepository extends Repository<AuthCode> {
  constructor(dataSource: DataSource) {
    super(AuthCode, dataSource.createEntityManager());
  }
}
