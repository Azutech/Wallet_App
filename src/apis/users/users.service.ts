import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './repository/user.repository';
import { DataSource } from 'typeorm';
import { WalletsRepository } from '../wallets/repository/wallet.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly walletsRepository: WalletsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: UserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const existingUser = await this.usersRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = await this.usersRepository.createUser({ ...dto });
      await this.walletsRepository.createWallet({ userId: user.id,  currency: 'NGN' });
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
