import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth_codes')
export class AuthCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 6,
  })
  code!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
