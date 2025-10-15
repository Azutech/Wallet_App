import { HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { UsersRepository } from '../users/repository/user.repository';
import { AppResponse } from 'src/common/app.response';
import { SetTransactionPinDto, WalletTransferDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async setTransactionPin(setTransactionPinDto: SetTransactionPinDto) {
    try {
      const { userId, newPin, confirmPin } = setTransactionPinDto;

      if (!/^\d{4}$/.test(newPin)) {
        return AppResponse.error({
          message: 'PIN must be 4 digits.',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      if (newPin !== confirmPin) {
        return AppResponse.error({
          message: 'PINs do not match.',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const user = await this.usersRepository.findUser(userId);
      if (!user) {
        return AppResponse.error({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      let pin = user.transactionPin;
      pin = hashSync(newPin, genSaltSync(10));
      await this.usersRepository.save(user);

      return { message: 'Transaction PIN set successfully' };
    } catch (error) {
      error.location = `TransactionService.${this.setTransactionPin.name} method`;
      AppResponse.error(error);
    }
  }

  async verifyTransactionPin(userId: string, pin: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user || !user.transactionPin)
        return AppResponse.error({
          message: 'PIN not set or user not found',
          status: HttpStatus.NOT_FOUND,
        });

      const validPin = compareSync(pin, user.transactionPin);
      if (!validPin) {
        return AppResponse.error({
          message: 'Invalid PIN',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return { message: 'PIN verified successfully' };
    } catch (error) {
      error.location = `TransactionService.${this.verifyTransactionPin.name} method`;
      AppResponse.error(error);
    }
  }

  async transferFunds(walletTransferDto: WalletTransferDto) {
    try {
      const { senderId, pin, recipientEmail, amount } = walletTransferDto;
      await this.verifyTransactionPin(senderId, pin);

      const sender = await this.walletsRepository.findWalletByUser(senderId);

      const recipient =
        await this.usersRepository.findUserEmail(recipientEmail);

      if (!recipient) {
        return AppResponse.error({
          message: 'Recipient wallet not found',
          status: HttpStatus.NOT_FOUND,
        });
      }
      const recipientWallet = await this.walletsRepository.findWalletById(
        recipient.id,
      );

      if (sender.balance < amount) {
        return AppResponse.error({
          message: 'Insufficient Balance',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      sender.balance -= amount;
      recipientWallet.balance += amount;

      await this.walletsRepository.save([sender, recipientWallet]);
      return { message: 'Transfer successful' };
    } catch (error) {
      error.location = `TransactionService.${this.verifyTransactionPin.name} method`;
      AppResponse.error(error);
    }
  }
}
