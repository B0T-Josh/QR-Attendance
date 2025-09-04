import QRCodeScanner from "@/app/components/QRCodeScanner.js";

export default function Scanner() {
    return (
        <>
            <div className="flex flex-col items-center gap-8 p-8">
                <QRCodeScanner />
            </div>  
        </>
    )
}