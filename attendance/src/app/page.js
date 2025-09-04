import QRCodeGenerator from "../app/components/QRGenerator.js";

export default function Home() {
  return (
    <div>
      <QRCodeGenerator />
      <a href="/scanner">Scan QR</a>
    </div>
  );
}