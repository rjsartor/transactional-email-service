import MailgunService from '../api/services/MailgunService';
import SendgridService from '../api/services/SendgridService';
import { EmailService, EmailServiceEnum, EmailPayload, EmailField } from '../types/email.types';

export const getEmailServices = (serviceProvider: EmailServiceEnum): {
  defaultService: EmailService;
  fallbackService: EmailService;
} => {
  const isSendgrid = serviceProvider === EmailServiceEnum.SENDGRID;

  const defaultService = isSendgrid ? new SendgridService() : new MailgunService();
  const fallbackService = isSendgrid ? new MailgunService() : new SendgridService();

  return { defaultService, fallbackService };
};

export const validateRequiredFields = (fields: EmailPayload): Partial<EmailField[]> => {
  const requiredFields: EmailField[] = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  const missingFields = requiredFields.filter((field) => typeof fields[field] !== 'string' || !fields[field]);
  return missingFields;
};

export const convertHtmlToPlainText = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};
