import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Flutterwave = require('flutterwave-node-v3');

@Injectable()
export class FlutterwaveService {
  private flw: typeof Flutterwave;

  constructor(
    readonly configService: ConfigService,
    readonly httpService: HttpService,
  ) {
    const publicKey = this.configService.get<string>('PUBLIC_KEY');
    const secretKey = this.configService.get<string>('SECRET_KEY');
    this.flw = new Flutterwave(publicKey, secretKey);
  }

  async getBanks() {
    try {
      const payload = {
        country: 'NG', //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
      };
      const response = await this.flw.Bank.country(payload);

      if (response?.data) {
        response.data = response.data.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async makePayment() {
    try {
      const payload = {
        account_bank: '044', //This is the recipient bank code. Get list here :https://developer.flutterwave.com/v3.0/reference#get-all-banks
        account_number: '0690000040',
        amount: 5500,
        narration: 'Akhlm Pstmn Trnsfr xx007',
        currency: 'NGN',
        reference: 'akhlm-pstmnpyt-r02ens007_PMCKDU_1', //This is a merchant's unique reference for the transfer, it can be used to query for the status of the transfer
        callback_url: 'https://www.flutterwave.com/ng/',
        debit_currency: 'NGN',
      };

      const response = await this.flw.Transfer.initiate(payload);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async initiateTransfer(payload: any) {
    const response = await this.httpService.axiosRef.post(
      'https://api.flutterwave.com/v3/transfers',
      payload,
      { headers: { Authorization: this.flw } },
    );
    return response.data;
  }
}
