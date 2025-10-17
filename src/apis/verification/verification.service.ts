import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VerificationService {
  private readonly baseUrl = 'https://api.sandbox.youverify.co';
  private readonly apiKey = 'VOxBvZsw.k6mXGCBBX57nI0zZfd4cbnAChDfwlFA7e4VU'; // 🔒 Replace with your actual API key

  constructor(private readonly httpService: HttpService) {}

  async verifyNIN(nin: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/v2/api/identity/ng/nin`;

      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };

      const body = {
        id: nin,
        isSubjectConsent: true, // YouVerify requires consent confirmation
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
}
