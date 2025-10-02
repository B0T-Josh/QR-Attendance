'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import {verifyUser} from "@/app/api/requests/request"

export default function StudentRecords() {
    const route = useRouter();
    const [loaded, setLoaded] = useState(false);
    const ranOnce = useRef(false);


    //Check if user is authorized.
    useEffect(() => {
        if(ranOnce.current) return;
        ranOnce.current = true;
        async function validate() {
            const {data} = await verifyUser();
            if(data) {
                if (data.admin === "false") {
                    if(data.success) {
                        setLoaded(true);   
                    }
                } else if(data.admin === "true") {
                    if(data.success) {
                        route.push("/adminDashboard/manageStudent");
                    }
                } 
            } else {
                route.push("/authPages/login");
            }
        }
        validate();
    }, []);
    
    return (
        <div className="flex">
            <div className="z-50">
                <Sidebar />
            </div>
            
            {loaded ? (
                <div>
                    <QRGenerator />
                </div>
            ) : <p></p>}
        </div>
    );
}