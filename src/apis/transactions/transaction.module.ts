import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UsersRepository } from 'src/apis/users/repository/user.repository';
import { WalletsRepository } from 'src/apis/wallets/repository/wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Wallet } from '../wallets/entity/wallet.entity';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
@Module({
  imports: [
    CustomJwtModule,
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, WalletsRepository, UsersRepository],
})
export class TransactionModule {}
