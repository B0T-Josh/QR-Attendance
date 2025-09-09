'use client';

import QRScanner from "@/components/QRScanner"
import Sidebar from "@/components/Sidebar";

export default function StudentRecords() {
    return (
        <div className="flex">
            <div className="z-50">
                <Sidebar />
            </div>
            
            <div >
                <QRScanner/>
            </div>
            
        </div>
    );
}