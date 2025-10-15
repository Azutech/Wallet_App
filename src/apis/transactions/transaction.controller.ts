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
import { SetTransactionPinDto } from './dto/transaction.dto';
import { AppResponse } from 'src/common/app.response';
import { Response } from 'express';

const { success } = AppResponse;

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('setTransactionPin')
  async create(
    @Res() res: Response,
    @Body() setTransactionPinDto: SetTransactionPinDto,
  ) {
    const result =
      await this.transactionService.setTransactionPin(setTransactionPinDto);
    return res
      .status(HttpStatus.CREATED)
      .json(success('Transaction PIN set successfully', 201, result));
  }
}
