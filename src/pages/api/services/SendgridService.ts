import { EmailPayload, EmailServiceEnum, SendgridRequestBody } from '@/pages/types/email.types';
import { convertHtmlToPlainText } from '@/pages/utils/email.utils';
import axios, { AxiosResponse } from 'axios';

class SendgridService {
  private baseUrl: string;
  private apiKey: string;
  public serviceName: EmailServiceEnum;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.baseUrl = `https://api.sendgrid.com/v3/mail/send`;
    this.serviceName = EmailServiceEnum.SENDGRID;
  }

  async send(payload: EmailPayload): Promise<AxiosResponse> {
    try {
      const requestBody = this.generateRequestBody(payload);
      const response = await axios.post(this.baseUrl, requestBody, {
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  private generateRequestBody({
    from,
    to,
    subject,
    body,
    from_name,
    to_name
  }: EmailPayload): SendgridRequestBody {
    return {
      personalizations: [
        {
          to: [
            {
              email: to,
              name: to_name,
            },
          ],
        },
      ],
      from: {
        email: from,
        name: from_name,
      },
      subject: subject,
      content: [
        {
          type: 'text/html',
          value: convertHtmlToPlainText(body),
        },
      ],
    };
  }
}

export default SendgridService;
