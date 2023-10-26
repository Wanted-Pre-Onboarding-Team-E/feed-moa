import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Repository } from 'typeorm';

export class HashtagRepository {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(post_id, hashtag) {
    const newHashtag = this.hashtagRepository.create({
      hashtag: [hashtag],
      post: { id: post_id },
    });
    return this.hashtagRepository.save(newHashtag);
  }
}
