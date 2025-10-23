import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  private readonly baseUrl = 'https://api.sandbox.youverify.co';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUVERIFY_API_KEY');
  }

  async verifyNIN(nin: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/v2/api/identity/ng/nin`;

      const headers = {
        token: this.apiKey, // 👈 Correct header per documentation
        'Content-Type': 'application/json',
      };

      const body = {
        id: nin,
        isSubjectConsent: true,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      return response.data;
    } catch (error) {
      console.error('NIN Verification failed:', error?.response?.data || error);
      throw new HttpException(
        error?.response?.data || 'Failed to verify NIN',
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  async verifyBVN(bvn: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/v2/api/identity/ng/nin`;

      const headers = {
        token: this.apiKey, // 👈 Correct header per documentation
        'Content-Type': 'application/json',
      };

      const body = {
        id: bvn,
        isSubjectConsent: true,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      return response.data;
    } catch (error) {
      console.error('NIN Verification failed:', error?.response?.data || error);
      throw new HttpException(
        error?.response?.data || 'Failed to verify BVN',
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
