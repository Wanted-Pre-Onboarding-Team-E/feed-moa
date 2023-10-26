import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  hashtag!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Post, (post) => post.hashtag)
  @Column()
  post: Post;
}
