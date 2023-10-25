import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {}
