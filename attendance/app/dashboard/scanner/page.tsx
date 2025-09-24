'use client';

import QRScanner from "@/components/QRScanner"
import Sidebar from "@/components/Sidebar";
import ToggleSidebar from "@/components/ToggleSidebar";
import { useEffect, useState } from "react";

export default function StudentRecords() {
    const [loaded, setLoaded] = useState(false);
    const [hidden, setHidden] = useState(false);
    
    useEffect(() => {
        setLoaded(true);
    }, [])
    
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
                <div >
                    <QRScanner/>
                </div>
            ) : <p></p>}
        </div>
    );
}