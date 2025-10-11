import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wallet } from '../../wallets/entity/wallet.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  BVN: string;

  @Column()
  avatar: string;

  @Column()
  dateOfBirth: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Wallet, (w) => w.user)
  wallets: Wallet[];
}
