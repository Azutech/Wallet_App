export class MailDispatcherDto {
  readonly from: string;
  readonly to: string | string[];
  readonly subject: string;
  readonly cc?: string | string[];
  readonly template?: string; // Optional template ID for dynamic templates
  readonly variables?: Record<string, any>; // Variables for dynamic templates
  readonly html?: string; // Optional HTML content
  readonly text?: string; // Optional plain text content
  readonly attachments?: {
    content: string; // Base64-encoded string
    filename: string; // Name of the file
    type?: string; // MIME type (e.g., 'application/pdf')
    disposition?: string; // 'inline' or 'attachment'
    contentId?: string; // Optional, used for inline images
  }[];
}
