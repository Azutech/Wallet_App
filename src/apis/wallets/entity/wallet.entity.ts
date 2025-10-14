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

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // store currency code (USD, NGN...) if needed
  @Column({ length: 3, default: 'NGN' })
  currency: string;

  // store balance in smallest currency unit (e.g. kobo/ngn cents) as bigint
  @Column({ type: 'bigint', default: 0 })
  balance: number; // keep as bigint in entity to avoid JS number issues

  @CreateDateColumn()
  createdAt: Date;
}
