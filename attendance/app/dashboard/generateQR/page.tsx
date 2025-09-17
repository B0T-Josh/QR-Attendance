'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getId } from "@/tools/getId"
import { validateTeacher } from "@/app/api/requests/request";

export default function StudentRecords() {
    const route = useRouter();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        async function validate() {
            const {success} = await validateTeacher({id: localStorage.getItem("id")});
            if(!success) {
                localStorage.removeItem("id");
                route.push("/authPages/login");
            } 
            setLoaded(true);
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