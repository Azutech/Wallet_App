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

  /**
   * Create a person in Synctera
   */
  async createCustomer(user: any): Promise<any> {
    const payload = {
      ban_status: 'ALLOWED',
      status: 'ACTIVE',
      is_customer: true,
      first_name: user.firstName || 'John',
      last_name: user.lastName || 'Doe',
      middle_name: user.middleName || '',
      email: `test-${Date.now()}@example.com `,
      phone_number: '+15551234567',
      dob: '1990-01-01',
      ssn: user.ssn || '111-11-1111', // Test SSN for sandbox
      
      legal_address: {
        address_line_1: user.street || '123 Main Street',
        address_line_2: user.addressLine2 || '',
        city: user.city || 'New York',
        state: user.state || 'NY',
        postal_code: user.postalCode || '10001',
        country_code: 'US',
      },

      shipping_address: {
        address_line_1: user.street || '123 Main Street',
        address_line_2: user.addressLine2 || '',
        city: user.city || 'New York',
        state: user.state || 'NY',
        postal_code: user.postalCode || '10001',
        country_code: 'US',
      },
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

      console.log('✅ Person created:', response.data.id);
      return response.data;
    } catch (err) {
      console.error('❌ Synctera createCustomer Failed:');
      console.error('➡️ Body:', JSON.stringify(payload, null, 2));
      console.error('➡️ Response:', JSON.stringify(err.response?.data, null, 2));

      throw new HttpException(
        `Synctera API Error: ${JSON.stringify(err.response?.data || err.message)}`,
        err.response?.status || 500,
      );
    }
  }


  // 3️⃣ Get person info (to check verification_status)
  async getPerson(personId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/persons/${personId}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Synctera getPerson error: ${JSON.stringify(error.response?.data || error.message)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async person() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/persons`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Synctera getPerson error: ${JSON.stringify(error.response?.data || error.message)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createVerification(personId: string) {
    const payload = {
      person_id: personId,
      result: 'ACCEPTED',
      verification_type: 'IDENTITY',
      verification_time: new Date().toISOString(),
      vendor_info: {
        vendor: 'SOURCE',
        content_type: 'application/json',
        json: {
          reference_id: `kyc_${Date.now()}`,
          verification_source: 'external',
        },
      },
      details: [
        {
          category: 'CIP',
          description: `Verified via external KYC`,
          result: 'PASS',
          score: 0.95,
          vendor_code: 'BVN',
          url: 'https://example.com/additional-info',
        },
      ],
      metadata: {},
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/verifications`, payload, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (err) {
      console.error('➡️ URL:', `${this.baseUrl}/persons`);
      console.error('➡️ Body:', JSON.stringify(payload, null, 2));
      console.error('➡️ Response:', err.response?.data);
      throw new HttpException(
        `Synctera verifyPerson error: ${JSON.stringify(err.response?.data || err.message)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


    /**
   * Create disclosure acknowledgment (required before verification)
   */
  async createDisclosure(personId: string) {
    const body = {
      person_id: personId,
      type: 'KYC_DATA_COLLECTION',
      version: '1.0',
      event_type: 'ACKNOWLEDGED',
      disclosure_date: new Date().toISOString(), // ✅ Use current date
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/disclosures`, body, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      console.log('✅ Disclosure created');
      return response.data;
    } catch (err) {
      console.error('❌ Disclosure creation failed:', err.response?.data);
      throw new HttpException(
        `Synctera disclosure error: ${JSON.stringify(err.response?.data)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


    /**
   * Verify person identity
   */
async verifyPerson(personId: string, customerIp?: string) {
    const body = {
      customer_consent: true,
      customer_ip_address: customerIp || '140.151.183.216',
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

      const verificationData = response.data;

      // ✅ Extract identity verification details
      const identityVerification = verificationData.verifications.find(
        (v) => v.verification_type === 'IDENTITY',
      );

      const watchlistVerification = verificationData.verifications.find(
        (v) => v.verification_type === 'WATCHLIST',
      );

      console.log('\n📊 Verification Results:');
      console.log('Status:', verificationData.verification_status);
      console.log('\n🔍 Identity Check:', identityVerification.result);
      console.log('Details:', JSON.stringify(identityVerification.details, null, 2));
      console.log('Vendor Info:', JSON.stringify(identityVerification.vendor_info, null, 2));
      console.log('\n🚨 Watchlist Check:', watchlistVerification.result);

      // Handle rejection
      if (verificationData.verification_status === 'REJECTED') {
        console.error('❌ Identity Verification REJECTED');
        
        // Find all failed checks
        const failedChecks = identityVerification.details.filter(
          d => d.result === 'FAIL'
        );

        console.error(`\n❌ Failed Checks (${failedChecks.length}):`);
        failedChecks.forEach((check, index) => {
          console.error(`  ${index + 1}. [${check.vendor_code}] ${check.description}`);
        });

        // Check if only alert list failed (R110)
        const isOnlyAlertListFail = 
          failedChecks.length === 1 && 
          failedChecks[0].vendor_code === 'R110';

        if (isOnlyAlertListFail) {
          console.warn('⚠️ Only Alert List (R110) failed - may qualify for manual review');
          console.warn('💡 Suggestion: Use a different email or request manual review');

          throw new BadRequestException({
            message: 'Email address flagged in fraud alert list',
            status: 'ALERT_LIST_MATCH',
            code: 'R110',
            suggestion: 'Use a different email address or contact support for manual review',
            details: failedChecks,
            canRetry: true,
          });
        }

        // Multiple failures - hard reject
        throw new BadRequestException({
          message: 'Identity verification failed',
          status: verificationData.verification_status,
          identityResult: identityVerification.result,
          failedChecks,
          details: identityVerification.details,
          vendorInfo: identityVerification.vendor_info,
        });
      }

      return verificationData;
    } catch (err) {
      // If it's our custom BadRequestException, rethrow it
      if (err instanceof BadRequestException) {
        throw err;
      }

      console.error('❌ Verification request failed:', err.response?.data);
      throw new HttpException(
        `Synctera verification error: ${JSON.stringify(err.response?.data || err.message)}`,
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
