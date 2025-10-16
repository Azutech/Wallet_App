import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsRepository } from './repository/payments.repository';
import { UsersRepository } from '../users/repository/user.repository';
import e from 'express';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async viewAllPaymentsForUser(userId: string) {
    const findUser = await this.usersRepository.findUser(userId);
    if (!findUser) {
      throw new NotFoundException(`User not Found`);
    }
    const payments = await this.paymentsRepository.findWithWallets(userId);
    if (!payments) {
      return [];
    }
    return payments;
  }
  async viewPaymentDetails(paymentId: string) {
    const payment = await this.paymentsRepository.findPayment(paymentId);
    if (!payment) {
      throw new NotFoundException('Wallet not found');
    }
    return payment;
  }
}
