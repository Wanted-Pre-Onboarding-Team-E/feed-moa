import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Post } from 'src/entity/post.entity';
import { Repository } from 'typeorm';

export class HashtagRepository {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(post_id: number, hashtags: string) {
    // const hashtagAsString = hashtags.toString();
    // console.log(typeof hashtagAsString);

    return this.hashtagRepository.save({
      hashtag: '톰',
      post: { id: post_id },
    });
  }
}
