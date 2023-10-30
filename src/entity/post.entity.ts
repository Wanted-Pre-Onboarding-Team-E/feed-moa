import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { PostType } from '../enum/postType.enum';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: PostType;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount!: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount!: number;

  @Column({ name: 'share_count', default: 0 })
  shareCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Hashtag, (hashtag) => hashtag.post, { cascade: true })
  hashtags: Hashtag[];
}
