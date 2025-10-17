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
import { Status } from '../enums/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
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

  @Column({ nullable: true, default: '' })
  NIN?: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth?: Date | null;

  @Column({ nullable: true, default: '' })
  nextOfKinName?: string;

  @Column({ nullable: true, default: '', type: 'varchar' })
  address?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true, default: '' })
  transactionPin?: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: string;

  @OneToMany(() => Wallet, (w) => w.user)
  wallets: Wallet[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];

  @OneToMany(() => Token, (t) => t.user)
  tokens: Token[];
}
