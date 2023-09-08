import MailgunService from "../api/services/MailgunService";
import SendgridService from "../api/services/SendgridService";

export enum EmailServiceEnum {
  MAILGUN = 'mailgun',
  SENDGRID = 'sendgrid',
}

export type EmailPayload = {
  to: string;
  to_name: string;
  from: string;
  from_name: string;
  subject: string;
  body: string;
  defaultService?: EmailServiceEnum;
}

export type EmailField = keyof EmailPayload;

export type EmailService = MailgunService | SendgridService;

export type SendgridRequestBody = {
  personalizations: [{
    to: [{
      email: string;
      name: string;
    }];
  }];
  from: {
    email: string;
    name: string;
  };
  subject: string;
  content: [{
    type: string;
    value: string;
  }];
};

