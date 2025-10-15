import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import { AppResponse } from 'src/common/app.response';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

const { success } = AppResponse;

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('userspayments')
  async viewAllPaymentsForUser(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const results = await this.paymentsService.viewAllPaymentsForUser(userId);
    return res
      .status(HttpStatus.OK)
      .json(success('Payments fetched successfully', 200, results));
  }

  @UseGuards(JwtAuthGuard)
  @Get('userspaymentsDetails')
  async viewPaymentDetails(
    @Res() res: Response,
    @Query('paymentId') paymentId: string,
  ) {
    const results = await this.paymentsService.viewPaymentDetails(paymentId);
    return res
      .status(HttpStatus.OK)
      .json(success('Payments fetched successfully', 200, results));
  }
}
