import React, { useState } from 'react';
import { QrCode, ScanLine } from 'lucide-react';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';

function App() {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Tool</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setMode('generate')}
                className={`px-4 py-4 text-sm font-medium flex items-center space-x-2 ${
                  mode === 'generate'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>Generate QR Code</span>
              </button>
              <button
                onClick={() => setMode('scan')}
                className={`px-4 py-4 text-sm font-medium flex items-center space-x-2 ${
                  mode === 'scan'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ScanLine className="w-5 h-5" />
                <span>Scan QR Code</span>
              </button>
            </nav>
          </div>

          <div className="p-4">
            {mode === 'generate' ? <QRGenerator /> : <QRScanner />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;