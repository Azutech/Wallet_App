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
import { Sex, Status } from '../enums/enums';
import { AddressI } from '../interfaces/users.interfaces';
import { Notification } from 'src/apis/notification/entity/notification.entity';
import { SecurityQuestions } from 'src/apis/security-questions/entity/question.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  BVN: string;

  @Column()
  avatar: string;

  @Column({ nullable: true, default: '' })
  NIN?: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth?: Date | null;

  @Column({ nullable: true, default: '' })
  nextOfKinName?: string;

  @Column({ nullable: true, default: '' })
  IRS?: string;

  @Column({ type: 'jsonb', nullable: true })
  address?: AddressI;

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
  status: Status;

  @Column({
    type: 'enum',
    enum: Sex,
    nullable: true,
  })
  sex: Sex;

  @OneToMany(() => Wallet, (w) => w.user)
  wallets: Wallet[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];

  @OneToMany(() => Token, (t) => t.user)
  tokens: Token[];

  @OneToMany(() => Token, (t) => t.user)
  notifications: Notification[];

  @OneToMany(() => Token, (t) => t.user)
  securityQuestions: SecurityQuestions[];
}
