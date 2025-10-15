import {
  Controller,
  Req,
  Post,
  Body,
  Res,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SetTransactionPinDto, WalletTransferDto } from './dto/transaction.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('setTransactionPin')
  async create(
    @Res() res: Response,
    @Body() setTransactionPinDto: SetTransactionPinDto,
  ) {
    const result =
      await this.transactionService.setTransactionPin(setTransactionPinDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Transaction PIN set successfully', result });
  }

  @UseGuards(JwtAuthGuard)
  @Post('walletTransfer')
  async walletTransfer(
    @Req() req: any,
    @Res() res: Response,
    @Body() walletTransferDto: WalletTransferDto,
  ) {
    walletTransferDto.senderId = req.user.userId;
    const transferFunds =
      await this.transactionService.transferFunds(walletTransferDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Funds transferred successfully', transferFunds });
  }
}
