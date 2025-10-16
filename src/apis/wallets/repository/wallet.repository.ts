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

  async findWalletById(userId: string): Promise<Wallet | null> {
    return await this.findOne({
      where: { id: userId },
    });
  }
  async findWalletByUser(userId: string): Promise<Wallet | null> {
    return await this.findOne({
      where: { userId: userId },
    });
  }
}
