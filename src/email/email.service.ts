import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDispatcherDto } from './dto/sendMail.dto';
import { Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendGridApiKey) {
      throw new Error('SENDGRID_API_KEY is not defined in the environment');
    }
    sgMail.setApiKey(sendGridApiKey);
  }

  async emailDispatcher(mailDispatcher: MailDispatcherDto) {
    try {
      const attachments = mailDispatcher.attachments?.map((attachment) => ({
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.type || 'application/octet-stream',
        disposition: attachment.disposition || 'attachment',
        contentId: attachment.contentId,
      }));

      const msg = {
        to: mailDispatcher.to ?? 'User',
        from:
          mailDispatcher.from ||
          this.configService.get<string>('DEFAULT_EMAIL_FROM'),
        subject: mailDispatcher.subject ?? 'Testing Email',
        text: mailDispatcher.text,
        html: mailDispatcher.html,
        attachments,
      };

      const response = await sgMail.send(msg);

      // Log successful email sending with more details
      this.logger.log('Email sent successfully', {
        to: msg.to,
        subject: msg.subject,
        responseStatus: response[0].statusCode,
      });

      return response;
    } catch (error) {
      // More detailed error logging
      this.logger.error('Email Sending Error', {
        message: error.message,
        details: error.response?.body || error,
        stack: error.stack,
      });

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
