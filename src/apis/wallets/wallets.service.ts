import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletsService {
  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
