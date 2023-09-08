import type { NextApiRequest, NextApiResponse } from 'next';
import { validateRequiredFields, getEmailServices } from '../utils/email.utils';

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  if (method !== 'POST') return res.status(405).json({ error: `${method} method not allowed.` });
  
  try {
    const { defaultService: defaultServiceProvider, ...requiredFields } = body;

    const missingFields = validateRequiredFields(requiredFields);
    if (missingFields.length) return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });

    const { defaultService, fallbackService } = getEmailServices(defaultServiceProvider);
    const defaultServiceName = defaultService.serviceName;
    const fallbackServiceName = fallbackService.serviceName;

    try {
      await defaultService.send(body);
      return res.status(200).json({ message: `Email sent successfully with ${defaultServiceName}.` });
    } catch (defaultServiceError) {
      console.error(`Error using ${defaultServiceName} service: ${defaultServiceError}`,);

      try {
        await fallbackService.send(body);
        return res.status(200).json({ message: `Email sent successfully with fallback service ${fallbackServiceName}.` });
      } catch (fallbackServiceError) {
        console.error(`Error using ${fallbackServiceName} service: ${fallbackServiceError}`, );
        return res.status(500).json({ error: 'Email sending failed with both services.' });
      }

    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export default sendEmail;