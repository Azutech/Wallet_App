import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity({ name: 'security_questions' })
export class SecurityQuestions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.securityQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  question: string; // e.g. "What is your mother's maiden name?"

  @Column({ type: 'varchar', length: 255 })
  answerHash: string; // hashed answer (bcrypt)

  @CreateDateColumn()
  createdAt: Date;
}
