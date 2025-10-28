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
    this.baseUrl = this.configService.get<string>('UNIT_API_URL');
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
      console.error('❌ Unit API Request Failed:');
      console.error('➡️ URL:', `${this.baseUrl}${path}`);
      console.error('➡️ Headers:', {
        Authorization: `Bearer ${this.apiKey?.slice(0, 8)}...`,
      });
      console.error('➡️ Body:', JSON.stringify(body, null, 2));
      console.error(
        '➡️ Response:',
        JSON.stringify(err.response?.data, null, 2),
      );
      console.error('➡️ Status:', err.response?.status);

      const msg = JSON.stringify(err.response?.data || err.message);
      throw new HttpException(
        `Unit API Error: ${msg}`,
        err.response?.status || 500,
      );
      //   const msg = err.response?.data || err.message;
      //   throw new HttpException(
      //     `Unit API Error: ${msg}`,
      //     err.response?.status || 500,
      //   );
    }
  }

  async createCustomer(user: any): Promise<string> {
    const payload = {
      data: {
        type: 'individualCustomer', // ✅ required exact type
        attributes: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          ssn: user.ssn ?? '123-45-6789', // temporary placeholder for sandbox
          dateOfBirth: user.dateOfBirth ?? '1990-01-01',
          address: {
            street: user.street ?? '123 Main Street',
            city: user.city ?? 'New York',
            state: user.state ?? 'NY',
            postalCode: user.postalCode ?? '10001',
            country: 'US',
          },
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
  /** 2️⃣ Create a Deposit Account (Virtual Account) */
  async createDepositAccount(
    customerId: string,
  ): Promise<UnitDepositAccountResponse> {
    const payload = {
      data: {
        type: 'depositAccount', // ✅ required literal type
        attributes: {
          depositProduct: 'checking', // ✅ must match a valid Unit product slug
          nickname: 'Primary Checking Account', // optional, for clarity
          currency: 'USD',
        },
        relationships: {
          customer: {
            data: {
              type: 'individualCustomer', // ✅ must match type used in customer creation
              id: customerId,
            },
          },
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
