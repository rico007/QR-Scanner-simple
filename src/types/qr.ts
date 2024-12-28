export type QRType = 'url' | 'wifi' | 'contact';

export interface QRData {
  type: QRType;
  data: Record<string, string>;
}

export interface QRFormFields {
  url: { url: string };
  wifi: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
  };
  contact: {
    name: string;
    phone: string;
    email: string;
    organization?: string;
  };
}