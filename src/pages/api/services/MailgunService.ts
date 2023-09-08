import axios, { AxiosResponse } from 'axios';
import { EmailPayload, EmailServiceEnum } from '@/pages/types/email.types';
import { convertHtmlToPlainText } from '@/pages/utils/email.utils';

class MailgunService {
  private baseUrl: string;
  private apiKey: string;
  private domainName: string;
  public serviceName: EmailServiceEnum;

  constructor() {
    this.apiKey = process.env.MAILGUN_API_KEY || '';
    this.domainName = process.env.MAILGUN_DOMAIN || 'sandboxf43bbc8c0b9a4ddf8e6a49c2e0b12a91.mailgun.org';
    this.baseUrl = `https://api.mailgun.net/v3`;
    this.serviceName = EmailServiceEnum.MAILGUN;
  }

  private generateRequestParams({
    from,
    to,
    from_name,
    to_name,
    subject,
    body,
  }: EmailPayload): URLSearchParams {
    const params = new URLSearchParams();

    params.append('from', `${from_name} ${from}`);
    params.append('to', `${to_name} ${to}`);
    params.append('subject', subject);
    params.append('text', convertHtmlToPlainText(body));

    return params;
  }

  async send(payload: EmailPayload): Promise<AxiosResponse> {
    try {
      const params = this.generateRequestParams(payload);
      const response = await axios.post(`${this.baseUrl}/${this.domainName}/messages`, params, {
        auth: {
          username: 'api',
          password: this.apiKey,
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      return response;
    } catch (error) {
      console.error('Mailgun Error:', error);
      throw error;
    }
  }
}

export default MailgunService;
