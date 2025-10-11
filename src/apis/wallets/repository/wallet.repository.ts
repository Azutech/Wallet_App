import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';

@Injectable()
export class WalletsRepository extends Repository<Wallet> {
  constructor(private dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }

  async createWallet(walletData: Partial<Wallet>): Promise<Wallet> {
    const newWallet = this.create(walletData);
    return await this.save(newWallet);
  }
}
