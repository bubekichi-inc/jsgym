import { MailService } from '@sendgrid/mail';

export class SendGridService {
  mailService: MailService;

  constructor() {
    this.mailService = new MailService();
    this.mailService.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendEmail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    try {
      await this.mailService.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@jsgym.shiftb.dev',
        subject,
        text,
        html: html || text,
      });
    } catch (error) {
      console.error("SendGridAPIError: ", error);
    }
  }
}
