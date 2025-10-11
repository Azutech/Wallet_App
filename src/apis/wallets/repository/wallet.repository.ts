import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';

@Injectable()
export class WalletsRepository extends Repository<Wallet> {
  constructor(private readonly dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }

  withManager(manager: EntityManager): WalletsRepository {
    return manager.getRepository(Wallet) as WalletsRepository;
  }

  async createWallet(walletData: Partial<Wallet>): Promise<Wallet> {
    const newWallet = this.create(walletData);
    return await this.save(newWallet);
  }
}
