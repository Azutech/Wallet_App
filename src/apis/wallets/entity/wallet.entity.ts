import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { CurrencyEnum, WalletTypeEnum } from '../enum/enum';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    default: CurrencyEnum.NGN,
  })
  currency: CurrencyEnum;

  @Column({
    type: 'enum',
    enum: WalletTypeEnum,
    default: WalletTypeEnum.FIAT,
  })
  walletType: WalletTypeEnum;

  @Column({ nullable: true })
  network?: string; // for crypto e.g. 'ERC20', 'TRC20'

  @Column({ nullable: true })
  address?: string; // for crypto wallet address

  @Column({ nullable: true })
  providerWalletId?: string;

  @Column({ type: 'bigint', nullable: true })
  accountNumber?: number;

  @Column({ type: 'varchar', nullable: true })
  bankName?: string;

  @Column({ type: 'varchar', nullable: true })
  accountName?: string;

  @Column({ type: 'bigint', nullable: true })
  routingNumber?: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;
}
