"use client";
import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator() {
  const [data, setData] = useState({
    Name : "",
    Subject : ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({...prev, [name]: value}));
  };  

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
      <input placeholder="Name" onChange={handleChange} name="Name" className="border rounded w-full"/>
      <br/>
      <input placeholder="Subject"onChange={handleChange} name="Subject" className="border rounded w-full" />
      <br/>
      <QRCodeCanvas value={JSON.stringify(data)} size={200} />
      <p className="mt-2 text-sm text-gray-600">
        Encoded: {JSON.stringify(data)}
      </p>
    </div>
  );
}