import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';
import { Response } from 'express';

@Controller('flutterwave')
export class FlutterwaveController {
  constructor(private readonly flutterwaveService: FlutterwaveService) {}

  @Get('banks')
  async banks(@Res() res: Response) {
    const bank = await this.flutterwaveService.getBanks();
    return res.status(HttpStatus.OK).json(bank);
  }
}
