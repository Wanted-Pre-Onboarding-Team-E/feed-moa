import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  password!: string;

  @Column({ name: 'is_active', default: false })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
