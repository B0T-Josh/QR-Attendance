"use client";
import { useState, useEffect } from 'react';
import { getId } from '@/tools/getId';
import encryptPassword from '../tools/encrypt';

export default function Popup() {
    const [verification, setVerification] = useState<{
        verification: string | null;
        confirm: string | null;
        id: string | null;
    }>({
        verification: "",
        confirm: "",
        id: ""
    });

    useEffect(() => {
        setVerification({
            ...verification,
            id: getId()
        });
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVerification(prev => ({
            ...prev,
            [e.target.name]: encryptPassword(e.target.value)
        }));
    }

    async function submit() {
        if(verification.verification !== verification.confirm) {
            alert("Confirm verification code doesn't match verification code");
            return;
        }
        const res = await fetch("/api/updateVerification", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(verification)
        }); 
        const {success, error} = await res.json();
        if(res.ok) {
            if(success) {
                alert(success);
            }
        } else {
            alert(error);
            return false;
        }
    }

    return(
        <div className='inset-0 z-10 flex flex-col justify-center items-center w-[20rem] h-[20rem] m-auto'>
            <div>
                <h1 className='p-4'>Setup a verification code</h1>
            </div>  
            <div className='flex flex-col justify-center items-center p-2'>
                <p className="text-left p-2">Enter your verification code: </p>
                <input name="verification" type="password" onChange={handleChange} placeholder="Enter recovery code" className='border-1 rounded'/>
                <p className="text-left p-2">Confirm your verification code: </p>
                <input name="confirm" type="password" onChange={handleChange} placeholder="Conmfirm recovery code" className='border-1 rounded'/>
            </div>
            <div className='p-4'>
                <button className='border rounded-lg w-[10rem]' onClick={submit}>Submit</button>
            </div>
        </div>
    )
}