'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import ToggleSidebar from "@/components/ToggleSidebar";
import {verifyUser} from "@/app/api/requests/request"

export default function StudentRecords() {
    const route = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [hidden, setHidden] = useState(false);

    //Check if th user is authorized.
    useEffect(() => {
        async function validate() {
            const {success} = await verifyUser();
            if (!success) {
                route.push("/authPages/login");
            }
        }
        validate();
    }, [loaded]);

    useEffect(() => {
        setLoaded(true);
    }, []);


    //Set hide status for navbar.
    function hide() {
        if(!hidden) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    }
    
    return (
        <div className="flex">
            <div className="z-50">
                <ToggleSidebar onToggle={hide}/>
                {hidden ? <div className="w-10"></div> : <Sidebar />}
            </div>
            
            {loaded ? (
                <div>
                    <QRGenerator />
                </div>
            ) : <p></p>}
        </div>
    );
}