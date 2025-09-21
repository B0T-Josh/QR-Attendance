'use client';

import QRScanner from "@/components/QRScanner"
import Sidebar from "@/components/Sidebar";
import { getId } from '@/tools/getId';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateTeacher } from "@/app/api/requests/request";

export default function StudentRecords() {
    const route = useRouter();
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