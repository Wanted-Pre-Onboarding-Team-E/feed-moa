import { Body, Controller, Param, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';

@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashService: HashtagService) {}

  @Post(':post_id')
  create(
    @Param('post_id') post_id: number,
    @Body()
    hashtag: string[],
  ) {
    return this.hashService.create(post_id, hashtag);
  }
}
