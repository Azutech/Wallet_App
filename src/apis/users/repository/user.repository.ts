import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.create({
      ...userData,
      wallets: undefined, // ✅ ignore wallets on create
    });

    return await this.save(newUser);
  }
}
