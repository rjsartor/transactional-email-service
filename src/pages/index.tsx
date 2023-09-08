import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { EmailServiceEnum } from './types/email.types';

type EmailInputProps = {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const EmailInput: React.FC<EmailInputProps> = ({ label, type, id, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id}>{label}:</label>
      <input
        className="bg-gray-600 p-2 rounded w-full"
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default function Home() {
  const [defaultService, setDefaultService] = useState<EmailServiceEnum>(EmailServiceEnum.MAILGUN);
  const [emailParams, setEmailParams] = useState({
    to: '',
    to_name: '',
    from: '',
    from_name: '',
    subject: '',
    body: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/email', { ...emailParams, defaultService }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.error('Email sending failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-start justify-start p-4">
      <div className="rounded shadow-md bg-gray-800 p-4">
        <h1 className="text-2xl font-semibold m-4">Email Service</h1>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="defaultProvider">Email Provider:</label>
            <select
              id="defaultProvider"
              value={defaultService}
              onChange={(e) => setDefaultService(e.target.value as EmailServiceEnum)}
              className="bg-gray-600 p-2 rounded w-full"
            >
              <option value={EmailServiceEnum.MAILGUN}>Mailgun</option>
              <option value={EmailServiceEnum.SENDGRID}>Sendgrid</option>
            </select>
          </div>
          <EmailInput
            label="To (email address)"
            type="email"
            id="to"
            value={emailParams.to}
            onChange={(e) => setEmailParams({ ...emailParams, to: e.target.value })}
          />
          <EmailInput
            label="To (name)"
            type="text"
            id="to_name"
            value={emailParams.to_name}
            onChange={(e) => setEmailParams({ ...emailParams, to_name: e.target.value })}
          />
          <EmailInput
            label="From (email address)"
            type="email"
            id="from"
            value={emailParams.from}
            onChange={(e) => setEmailParams({ ...emailParams, from: e.target.value })}
          />
          <EmailInput
            label="From (name)"
            type="text"
            id="from_name"
            value={emailParams.from_name}
            onChange={(e) => setEmailParams({ ...emailParams, from_name: e.target.value })}
          />
          <EmailInput
            label="Subject"
            type="text"
            id="subject"
            value={emailParams.subject}
            onChange={(e) => setEmailParams({ ...emailParams, subject: e.target.value })}
          />
          <div className="mb-4">
            <label htmlFor="body">Message:</label>
            <textarea
              className="bg-gray-600 p-2 rounded w-full"
              id="body"
              value={emailParams.body}
              onChange={(e) => setEmailParams({ ...emailParams, body: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}
