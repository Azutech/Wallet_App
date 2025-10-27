import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  UnitCustomerResponse,
  UnitDepositAccountResponse,
} from './interfaces/unit.interface';

@Injectable()
export class UnitService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    readonly configService: ConfigService,
    readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('UNIT_SERVER_URL');
    this.apiKey = this.configService.get<string>('UNIT_SECRET_KEY');
  }

  private async unitPost<T>(path: string, body: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(`${this.baseUrl}${path}`, body, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data || err.message;
      throw new HttpException(
        `Unit API Error: ${msg}`,
        err.response?.status || 500,
      );
    }
  }

  async createCustomer(user: any): Promise<string> {
    const payload = {
      data: {
        type: 'customer',
        attributes: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    };

    const resp = await this.unitPost<UnitCustomerResponse>(
      '/customers',
      payload,
    );
    if (!resp?.data?.id) {
      throw new BadRequestException('Failed to create Unit customer');
    }
    return resp.data.id;
  }

  /** 2️⃣ Create a Deposit Account (Virtual Account) */
  async createDepositAccount(
    customerId: string,
  ): Promise<UnitDepositAccountResponse> {
    const payload = {
      data: {
        type: 'depositAccount',
        attributes: {
          depositProduct: 'checking', // or your product type configured in Unit dashboard
          currency: 'USD',
        },
        relationships: {
          customer: { data: { type: 'customer', id: customerId } },
        },
      },
    };

    const resp = await this.unitPost<UnitDepositAccountResponse>(
      '/deposit-accounts',
      payload,
    );
    if (!resp?.data?.attributes?.accountNumber) {
      throw new BadRequestException('Failed to create Unit deposit account');
    }
    return resp;
  }
}
