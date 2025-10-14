import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UsersRepository } from 'src/apis/users/repository/user.repository';
import { WalletsRepository } from 'src/apis/wallets/repository/wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entity/user.entity';
import { Wallet } from 'src/apis/wallets/entity/wallet.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, WalletsRepository, UsersRepository],
})
export class TransactionModule {}
