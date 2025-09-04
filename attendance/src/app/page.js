import QRCodeGenerator from "../app/components/QRCodeGenerator.js";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <QRCodeGenerator />
    </main>
  );
}
