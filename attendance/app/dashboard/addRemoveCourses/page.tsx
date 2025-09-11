'use client';

import Sidebar from "@/components/Sidebar";
import {useState, useEffect} from 'react';
import getId from './page';
import { useRouter } from "next/navigation";

export default function StudentRecords() {
    const router = useRouter();
    const [subject, setSubject] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value);
    }

    if(getId() === null) {
        alert("Unauthorized user. Log in first");
        router.push("/authPages/login");
    } 
    
    return (
        <div>
            <Sidebar />
            <div>
                
            </div>            
        </div>
    );
}