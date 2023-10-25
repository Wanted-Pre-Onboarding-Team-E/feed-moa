import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: string;

  // 추후 enum 생성후 변경할 예정
  @Column()
  type!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ name: 'view_count' })
  viewCount!: string;

  @Column({ name: 'like_count' })
  likeCount!: string;

  @Column({ name: 'share_count' })
  shareCount!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
