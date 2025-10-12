import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  email: string;

  @Column({})
  code: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({})
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email' })
  user: User;
}
