"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      /* verbose= */ false
    );

    scanner.render((decodedText) => {
        alert("Decoded text: " + decodedText);
        setScannedData(decodedText);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Failed to clear scanner", err));
    };
  }, []);

    let content;

    if (!scannedData) {
    content = <p>No result yet...</p>;
    } else if (scannedData.startsWith("http")) {
    content = (
        <a
        href={scannedData}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
        >
        Open {scannedData}
        </a>
    );
    } else {
    content = <p>Scanned Text: {scannedData}</p>;
    }

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
      <div id="reader" style={{ width: "300px" }}></div>
      <div className="mt-4 p-2 border rounded w-full">
        {content}
      </div>
    </div>
  );
}
