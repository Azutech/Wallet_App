import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { UsersRepository } from '../users/repository/user.repository';
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
        throw new BadRequestException('PIN must be 4 digits.');
      }

      if (newPin !== confirmPin) {
        throw new BadRequestException('PINs do not match.');
      }

      const user = await this.usersRepository.findUser(userId);
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      let pin = user.transactionPin;
      pin = hashSync(newPin, genSaltSync(10));
      await this.usersRepository.save(user);

      return { message: 'Transaction PIN set successfully' };
    } catch (error) {
      error.location = `TransactionService.${this.setTransactionPin.name} method`;
      throw error;
    }
  }

  async verifyTransactionPin(userId: string, pin: string) {
    try {
      const user = await this.usersRepository.findUser(userId);
      if (!user || !user.transactionPin) {
        throw new NotFoundException('User not found.');
      }

      const validPin = compareSync(pin, user.transactionPin);

      if (!validPin) {
        throw new BadRequestException('Wrong PIN.');
      }

      return { message: 'PIN verified successfully' };
    } catch (error) {
      error.location = `TransactionService.${this.verifyTransactionPin.name} method`;
      throw error;
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
        throw new NotFoundException('Recipient wallet not found.');
      }
      const recipientWallet = await this.walletsRepository.findWalletById(
        recipient.id,
      );

      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient Balance.');
      }

      sender.balance -= amount;
      recipientWallet.balance += amount;

      await this.walletsRepository.save([sender, recipientWallet]);
      return { message: 'Transfer successful' };
    } catch (error) {
      error.location = `TransactionService.${this.verifyTransactionPin.name} method`;
      throw error;
    }
  }
}
