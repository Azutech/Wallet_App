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
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import { AppResponse } from 'src/common/app.response';


const { success } = AppResponse;

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('userspayments')
  async viewAllPaymentsForUser(@Req() req: any, @Res() res: Response,  @Query('userId') userId: string) {

    const results = await this.paymentsService.viewAllPaymentsForUser(userId);
    return res.status(HttpStatus.OK).json(success('Payments fetched successfully', 200, results)  );
  }

  @Get(':id')
  async viewPaymentDetails(@Param('id') id: string) {
    return this.paymentsService.viewPaymentDetails(id);
  }

}
