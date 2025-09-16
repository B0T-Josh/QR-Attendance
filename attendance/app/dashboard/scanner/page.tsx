'use client';

import QRScanner from "@/components/QRScanner"
import Sidebar from "@/components/Sidebar";
import { getId } from '@/tools/getId';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentRecords() {
    const route = useRouter();

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
    }, []);

    return (
        <div className="flex">
            {/* <div className="z-50">
                <Sidebar />
            </div> */}
            
            <div >
                <QRScanner/>
            </div>
            
        </div>
    );
}