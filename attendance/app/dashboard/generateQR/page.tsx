'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getId } from "@/tools/getId"
import { validateTeacher } from "@/app/api/requests/request";
import ToggleSidebar from "@/components/ToggleSidebar";

export default function StudentRecords() {
    const route = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [id, setId] = useState<string | null>(null);

    //Check if th user is authorized.
    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        async function validate() {
            const {success} = await validateTeacher({uid: localStorage.getItem("id")});
            if(success) {
                setId(localStorage.getItem("id"));
            } else {
                localStorage.removeItem("id");
                route.push("/authPages/login");
            }
        }
        validate();
    }, []);

    //Set loaded as true after setting the id 
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1000);
    }, [id]);

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