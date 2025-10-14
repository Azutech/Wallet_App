import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Returns a transaction-scoped instance of this repository
   */
  withManager(manager: EntityManager): UsersRepository {
    return manager.getRepository(User) as UsersRepository;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.create({
      ...userData,
      wallets: undefined, // ✅ ignore wallets on create
    });

    return await this.save(newUser);
  }

  async findWithWallets(userId: string): Promise<User | null> {
    return await this.findOne({
      where: { id: userId },
      relations: ['wallets'],
    });
  }
  async findUser(userId: string): Promise<User | null> {
    return await this.findOne({
      where: { id: userId },
    });
  }
}
