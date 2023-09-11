import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { EmailServiceEnum } from './types/email.types';

type RequestStatus = {
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
};

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

const defaultForm = {
  to: '',
  to_name: '',
  from: '',
  from_name: '',
  subject: '',
  body: '',
}

export default function Home() {
  const [defaultService, setDefaultService] = useState<EmailServiceEnum>(EmailServiceEnum.MAILGUN);
  const [status, setStatus] = useState<RequestStatus>({
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
  });
  const [formData, setFormData] = useState(defaultForm);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ isLoading: true, isSuccess: false, errorMessage: null });

    try {
      const response = await axios.post('/api/email', { ...formData, defaultService }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setStatus({ isLoading: false, isSuccess: true, errorMessage: null });
        setFormData(prev => ({ ...defaultForm, from: prev.from, from_name: prev.from_name }));
      }

    } catch (error: any) {
      setStatus({ isLoading: false, isSuccess: false, errorMessage: error?.response?.data?.error || error?.message || 'Error occurred' });
      console.error(error);
    }
};

  const incompleteFields = (): boolean => {
    return Object.values(formData).some(value => value.trim() === '');
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
            label="From (email address)"
            type="email"
            id="from"
            value={formData.from}
            onChange={handleInputChange}
          />
          <EmailInput
            label="From (name)"
            type="text"
            id="from_name"
            value={formData.from_name}
            onChange={handleInputChange}
          />
          <EmailInput
            label="To (email address)"
            type="email"
            id="to"
            value={formData.to}
            onChange={handleInputChange}
          />
          <EmailInput
            label="To (name)"
            type="text"
            id="to_name"
            value={formData.to_name}
            onChange={handleInputChange}
          />
          <EmailInput
            label="Subject"
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
          <div className="mb-4">
            <label htmlFor="body">Message:</label>
            <textarea
              className="bg-gray-600 p-2 rounded w-full"
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status.isLoading || incompleteFields()}
          >
            Send Email
          </button>
        </form>
        {status.isLoading && <p>Sending email...</p>}
        {status.isSuccess && <p>Email sent successfully!</p>}
        {status.errorMessage && <p className="text-red-500">{status.errorMessage}</p>}
      </div>
    </div>
  );
}
