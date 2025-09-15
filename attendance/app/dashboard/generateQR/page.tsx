'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getId } from "@/tools/getId"

export default function StudentRecords() {
    const route = useRouter();
    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
    }, []);
    
    return (
        <div className="flex">
            <div className="z-50">
                <Sidebar />
            </div>
            
            <div>
                <QRGenerator />
            </div>
            
        </div>
    );
}