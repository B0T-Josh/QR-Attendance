"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator() {
  let data = "http://localhost:3000";

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>

      <QRCodeCanvas value={data} size={200} />
      <p className="mt-2 text-sm text-gray-600">
        Encoded: {data}
      </p>
    </div>
  );
}
