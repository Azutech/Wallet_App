import { HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { WalletsRepository } from '../apis/wallets/repository/wallet.repository';
import { UsersRepository } from '../apis/users/repository/user.repository';
import { AppResponse } from 'src/common/app.response';

@Injectable()
export class TransactionService {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

    async setTransactionPin(userId: string, newPin: string) {
    if (!/^\d{4,6}$/.test(newPin)) {

        return AppResponse.error({
          message: 'PIN must be 4–6 digits.',
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

    let pin = user.transactionPin
    pin = hashSync(newPin, genSaltSync(10));
    await this.usersRepository.save(user);

    return { message: 'Transaction PIN set successfully' };
  }

  async verifyTransactionPin(userId: string, pin: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
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
  }
}
