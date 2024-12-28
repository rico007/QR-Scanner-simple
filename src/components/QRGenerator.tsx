import React, { useState } from 'react';
import QRCode from 'qrcode';
import { QRType, QRData, QRFormFields } from '../types/qr';
import { QrCode } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const [step, setStep] = useState<'type' | 'form' | 'result'>('type');
  const [qrType, setQRType] = useState<QRType>('url');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateQRCode = async (data: QRData) => {
    let qrString = '';
    
    switch (data.type) {
      case 'url':
        qrString = data.data.url;
        break;
      case 'wifi':
        qrString = `WIFI:T:${data.data.encryption};S:${data.data.ssid};P:${data.data.password};;`;
        break;
      case 'contact':
        qrString = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.data.name}\nTEL:${data.data.phone}\nEMAIL:${data.data.email}\nORG:${data.data.organization || ''}\nEND:VCARD`;
        break;
    }

    try {
      const url = await QRCode.toDataURL(qrString);
      setQrCodeUrl(url);
      setStep('result');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateQRCode({ type: qrType, data: formData });
  };

  const renderTypeSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">What type of QR code do you want to create?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['url', 'wifi', 'contact'] as QRType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setQRType(type);
              setStep('form');
              setFormData({});
            }}
            className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <QrCode className="w-8 h-8" />
              <span className="capitalize">{type}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderForm = () => {
    const fields = {
      url: [{ name: 'url', label: 'Website URL', type: 'url' }],
      wifi: [
        { name: 'ssid', label: 'Network Name (SSID)', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        {
          name: 'encryption',
          label: 'Security',
          type: 'select',
          options: ['WPA', 'WEP', 'nopass'],
        },
      ],
      contact: [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'phone', label: 'Phone Number', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'organization', label: 'Organization (Optional)', type: 'text' },
      ],
    }[qrType];

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Enter {qrType} details</h2>
        {fields.map(({ name, label, type, options }) => (
          <div key={name} className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {type === 'select' ? (
              <select
                id={name}
                value={formData[name] || ''}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select security type</option>
                {options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                id={name}
                value={formData[name] || ''}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={name !== 'organization'}
              />
            )}
          </div>
        ))}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setStep('type')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate QR Code
          </button>
        </div>
      </form>
    );
  };

  const renderResult = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
      <div className="flex flex-col items-center space-y-4">
        <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
        <button
          onClick={() => setStep('type')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {step === 'type' && renderTypeSelection()}
      {step === 'form' && renderForm()}
      {step === 'result' && renderResult()}
    </div>
  );
};

export default QRGenerator;