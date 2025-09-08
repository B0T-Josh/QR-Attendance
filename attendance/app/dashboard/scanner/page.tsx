'use client';

import QRScanner from "./QRScanner"
import Sidebar from "@/components/Sidebar";

export default function StudentRecords() {
    return (
        <div>
            <Sidebar />
            <QRScanner/>
        </div>
    );
}