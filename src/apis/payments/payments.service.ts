import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsRepository } from './repository/payments.repository';
import { UsersRepository } from '../users/repository/user.repository';
import { AppResponse } from 'src/common/app.response';
import e from 'express';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async viewAllPaymentsForUser(userId: string) {
    try {
      const findUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!findUser) {
        return AppResponse.error({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }
      const payments = await this.paymentsRepository.findWithWallets(userId);
      if (!payments) {
        return [];
      }
      return payments;
    } catch (err) {
      err.location = `PaymentsService.${this.viewAllPaymentsForUser.name} method`;
      return AppResponse.error(err);
    }
  }
  async viewPaymentDetails(paymentId: string) {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { id: paymentId },
      });
      if (!payment) {
        return AppResponse.error({
          message: 'Payment not found',
          status: HttpStatus.NOT_FOUND,
        });
      }
      return payment;
    } catch (err) {
      err.location = `PaymentsService.${this.viewPaymentDetails.name} method`;
      return AppResponse.error(err);
    }
  }
}
