import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/user.repository';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../wallets/entity/wallet.entity';
import { User } from './entity/user.entity';

@Module({
  imports: [CustomJwtModule, TypeOrmModule.forFeature([User, Wallet])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, WalletsRepository],
})
export class UsersModule {}
