import sendEmail from "../src/pages/api/email"
import MailgunService from "../src/pages/api/services/MailgunService";
import SendgridService from "../src/pages/api/services/SendgridService";
import { EmailServiceEnum } from "../src/pages/types/email.types";

const createMockRequest = (method, body) => ({
  method,
  body,
});

const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

const emailPayload = {
  to: 'reciver@mail.com', 
  to_name: 'Receiver', 
  from: 'sender@mail.com', 
  from_name: 'Sender', 
  subject: 'Test', 
  body: 'This is a test', 
  defaultService: EmailServiceEnum.MAILGUN,
};

describe('sendEmail', () => {
  let mockResponse;
  beforeEach(() => {
    mockResponse = createMockResponse();
  });

  it('should return 405 Method Not Allowed for non-POST request', async () => {
    await sendEmail(createMockRequest('GET'), mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'GET method not allowed.' });
  });

  it('should return 400 Bad Request for missing fields', async () => {
    await sendEmail(createMockRequest('POST', {}), mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Missing required fields: to, to_name, from, from_name, subject, body' });
  });

  it('should send email successfully with default email service', async () => {
    jest.spyOn(MailgunService.prototype, 'send').mockImplementation();

    await sendEmail(createMockRequest('POST', emailPayload), mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `Email sent successfully with ${EmailServiceEnum.MAILGUN}.` });
  });

  it('should send email successfully with fallback service if default fails', async () => {
    jest.spyOn(MailgunService.prototype, 'send').mockRejectedValue(new Error('Mailgun failed'));
    jest.spyOn(SendgridService.prototype, 'send').mockImplementation();

    await sendEmail(createMockRequest('POST', emailPayload), mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `Email sent successfully with fallback service ${EmailServiceEnum.SENDGRID}.` });
  });

  it('should return 500 when all services fail', async () => {
    jest.spyOn(SendgridService.prototype, 'send').mockRejectedValue(new Error('Sendgrid failed'));
    jest.spyOn(MailgunService.prototype, 'send').mockRejectedValue(new Error('Mailgun failed'));

    await sendEmail(createMockRequest('POST', emailPayload), mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email sending failed with both services.' });
  });
});
