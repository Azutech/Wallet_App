import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/user.repository';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../wallets/entity/wallet.entity';
import { User } from './entity/user.entity';
import { TokenRepository } from './repository/token.repository';
import { Token } from './entity/token.entity';
import { VerificationService } from '../verification/verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CustomJwtModule,
    HttpModule,
    TypeOrmModule.forFeature([User, Wallet, Token]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    WalletsRepository,
    TokenRepository,
    VerificationService,
  ],
})
export class UsersModule {}
