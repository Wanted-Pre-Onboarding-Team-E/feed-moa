import { Injectable } from '@nestjs/common';
import { HashtagRepository } from './repository/hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(private hashtagRepository: HashtagRepository) {}

  create(post_id, hashtag) {
    return this.hashtagRepository.create(post_id, hashtag);
  }
}
