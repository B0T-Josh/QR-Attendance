'use client';

import QRScanner from "@/components/QRScanner"
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function StudentRecords() {
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(true);
    }, [])

    return (
        <div className="flex">
            <div className="z-50">
                <Sidebar />
            </div>
            {loaded ? (
                <div >
                    <QRScanner/>
                </div>
            ) : <p></p>}
        </div>
    );
}