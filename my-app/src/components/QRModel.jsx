import { QRCodeCanvas } from "qrcode.react";
import React from 'react';

export default function QRModel({ password, onClose }) {
  if (!password) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <QRCodeCanvas value={password} size={200} />
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
