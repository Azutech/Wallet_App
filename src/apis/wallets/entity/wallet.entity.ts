// FILE: src/entities/wallet.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.wallets, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @Index()
  userId: string;

  // store currency code (USD, NGN...) if needed
  @Column({ length: 3, default: 'NGN' })
  currency: string;

  // store balance in smallest currency unit (e.g. kobo/ngn cents) as bigint
  @Column({ type: 'bigint', default: 0 })
  balance: string; // keep as string in entity to avoid JS number issues

  @CreateDateColumn()
  createdAt: Date;
}
