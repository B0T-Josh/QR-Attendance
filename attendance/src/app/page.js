import QRCodeGenerator from "../app/components/QRCodeGenerator.js";
import QRCodeScanner from "../app/components/QRCodeScanner.js";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <QRCodeGenerator />
      <QRCodeScanner />
    </main>
  );
}
