import { Injectable } from '@nestjs/common';
import { HashtagRepository } from './repository/hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(private hashtagRepository: HashtagRepository) {}

  async create(post_id: number, hashtag: string) {
    return await this.hashtagRepository.create(post_id, hashtag);
  }
}
