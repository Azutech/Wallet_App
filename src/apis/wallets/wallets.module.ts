import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletsRepository } from './repository/wallet.repository';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
