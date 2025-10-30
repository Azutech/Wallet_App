import {
  Injectable,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SyncteraAccount, SyncteraCustomer } from './interfaces/unit.interface';

@Injectable()
export class SyncterService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('SYNCTERA_BASE_URL');
    this.apiKey = this.configService.get<string>('SYNCTERA_API_KEY');
  }

  private async syncteraPost<T>(path: string, body: any): Promise<T> {
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
      console.error('❌ Synctera API Request Failed:');
      console.error('➡️ URL:', `${this.baseUrl}${path}`);
      console.error('➡️ Body:', JSON.stringify(body, null, 2));
      console.error('➡️ Response:', err.response?.data || err.message);
      console.error('➡️ Status:', err.response?.status);
      throw new HttpException(
        `Synctera API Error: ${JSON.stringify(err.response?.data || err.message)}`,
        err.response?.status || 500,
      );
    }
  }

  async createCustomer(user: any): Promise<any> {
    const payload = {
      ban_status: 'ALLOWED',
      status: 'ACTIVE',
      is_customer: true,
      first_name: user.firstName || 'John',
      last_name: user.lastName || 'Doe',
      middle_name: user.middleName || '',
      chosen_name: user.chosenName || user.firstName || 'John',
      email: user.email,
      phone_number: user.phoneNumber || '+15551234567',
      dob: '1990-01-01',
      ssn: user.ssn || '123-45-6789',

      legal_address: {
        address_line_1: user.street || '123 Main Street',
        address_line_2: user.addressLine2 || '',
        city: user.city || 'New York',
        state: user.state || 'NY',
        postal_code: user.postalCode || '10001',
        country_code: user.country || 'US',
        nickname: 'Home',
        is_registered_agent: true,
      },

      shipping_address: {
        address_line_1: user.street || '123 Main Street',
        address_line_2: user.addressLine2 || '',
        city: user.city || 'New York',
        state: user.state || 'NY',
        postal_code: user.postalCode || '10001',
        country_code: user.country || 'US',
        nickname: 'Home',
        is_registered_agent: true,
      },

      personal_ids: [
        {
          id_type: 'SSN',
          identifier: user.ssn || '123-45-6789',
          country_code: 'US',
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/persons`, payload, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data; // returns the full Synctera Person object (with `id`)
    } catch (err) {
      console.error('❌ Synctera API Request Failed:');
      console.error('➡️ URL:', `${this.baseUrl}/persons`);
      console.error('➡️ Body:', JSON.stringify(payload, null, 2));
      console.error('➡️ Response:', err.response?.data);
      console.error('➡️ Status:', err.response?.status);

      throw new HttpException(
        `Synctera API Error: ${JSON.stringify(err.response?.data || err.message)}`,
        err.response?.status || 500,
      );
    }
  }

  async verifyPerson(personId: string, ipAddress: string) {
    const body = {
      customer_consent: true,
      customer_ip_address: ipAddress,
      person_id: personId,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/verifications/verify`, body, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (err) {
      console.error('➡️ URL:', `${this.baseUrl}/persons`);
      console.error('➡️ Body:', JSON.stringify(body, null, 2));
      console.error('➡️ Response:', err.response?.data);
      throw new HttpException(
        `Synctera verifyPerson error: ${JSON.stringify(err.response?.data || err.message)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ✅ Create a deposit account for the customer
  async createVirtualAccount(personId: string) {
    const payload = {
      account_type: 'CHECKING',
      name: 'Main Wallet',
      currency: 'USD',
      status: 'OPEN',
      relationship_data: {
        relationship_type: 'PRIMARY_OWNER',
        related_person_id: personId,
      },
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/accounts`, payload, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      console.log('✅ Synctera Virtual Account Created:', data);
      return data;
    } catch (err) {
      console.error('❌ Synctera Error:', err.response?.data || err.message);
      throw new HttpException(
        `Synctera API Error: ${JSON.stringify(err.response?.data || err.message)}`,
        err.response?.status || 500,
      );
    }
  }

  // ✅ Quick test endpoint
  async testConnection() {
    try {
      const resp = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/customers`, {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }),
      );
      return resp.data;
    } catch (err) {
      console.error('❌ Connection failed:', err.message);
      throw new InternalServerErrorException('Synctera connection failed');
    }
  }
}
