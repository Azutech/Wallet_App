import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Payment } from '../entity/payment.entity';
import { UsersRepository } from 'src/apis/users/repository/user.repository';
import { User } from 'src/apis/users/entity/user.entity';

@Injectable()
export class PaymentsRepository extends Repository<Payment> {
  constructor(private readonly dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

  /**
   * Returns a transaction-scoped instance of this repository
   */
  withManager(manager: EntityManager): PaymentsRepository {
    return manager.getRepository(Payment) as PaymentsRepository;
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const newPayment = this.create({
      ...paymentData,
    });

    return await this.save(newPayment);
  }

  async findWithWallets(userId: string): Promise<Payment | null> {
    return await this.findOne({
      where: { userId: userId },
      relations: ['payments'],
    });
  }
  async findPayment(paymentId: string): Promise<Payment | null> {
    return await this.findOne({
      where: { id: paymentId },
    });
  }
}
