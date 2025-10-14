import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wallet } from '../../wallets/entity/wallet.entity';
import { Token } from './token.entity';
import { Payment } from '../../payments/entity/payment.entity';

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

    @Column({ nullable: true })
  transactionPin?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'suspended', 'deactivated'],
    default: 'pending',
  })
  status: 'pending' | 'verified' | 'suspended' | 'deactivated';

  @OneToMany(() => Wallet, (w) => w.user)
  wallets: Wallet[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];

  @OneToMany(() => Token, (t) => t.user)
  tokens: Token[];
}
