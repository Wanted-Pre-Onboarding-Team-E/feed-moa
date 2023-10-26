import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('simple-array')
  hashtag!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Post, (post) => post.hashtags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post?: Post;
}
