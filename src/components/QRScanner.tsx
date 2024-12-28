import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, Camera } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startScanning = async () => {
      try {
        scanner = new Html5Qrcode('reader');
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setResult(decodedText);
            if (scanner) {
              scanner.stop();
              setScanning(false);
            }
          },
          () => {}
        );
        setScanning(true);
        setError(null);
      } catch (err: any) {
        setScanning(false);
        if (err.message.includes('NotAllowedError')) {
          setError('Camera permission was denied. Please allow camera access to scan QR codes.');
        } else {
          setError('Failed to start camera. Please make sure your device has a camera and try again.');
        }
        console.error(err);
      }
    };

    if (scanning && !scanner) {
      startScanning();
    }

    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [scanning]);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setError(null);
  };

  const handleAction = () => {
    if (result) {
      if (result.startsWith('http')) {
        window.open(result, '_blank');
      } else if (result.startsWith('WIFI:')) {
        // Display WiFi details
        const wifi = result.match(/WIFI:T:(.*?);S:(.*?);P:(.*?);;/);
        if (wifi) {
          alert(`Network: ${wifi[2]}\nPassword: ${wifi[3]}\nSecurity: ${wifi[1]}`);
        }
      } else if (result.startsWith('BEGIN:VCARD')) {
        // Display contact details
        const contact = result.match(/FN:(.*?)\nTEL:(.*?)\nEMAIL:(.*?)\n/);
        if (contact) {
          alert(`Name: ${contact[1]}\nPhone: ${contact[2]}\nEmail: ${contact[3]}`);
        }
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
        
        <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-lg"></div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {!scanning && !result && (
          <button
            onClick={handleScan}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Scan className="w-5 h-5" />
            <span>Start Scanning</span>
          </button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Scanned Result:</h3>
              <p className="break-all">{result}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleScan}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Scan Again
              </button>
              <button
                onClick={handleAction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Take Action
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;