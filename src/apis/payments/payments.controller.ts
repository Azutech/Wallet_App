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
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

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
      .json({ message: 'Payments fetched successfully', results });
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
      .json({ message: 'Payments fetched successfully', results });
  }
}
