"use client";
import { useState, useEffect } from 'react';
import { getId } from '@/tools/getId';
import encryptPassword from '../tools/encrypt';

export default function Popup() {
    const [loaded, setLoaded] = useState(false);

    const [verification, setVerification] = useState<{
        verification: string | null;
        confirm: string | null;
        id: string | null;
    }>({
        verification: "",
        confirm: "",
        id: ""
    });
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setVerification({
            ...verification,
            id: getId()
        });
        setLoaded(true);
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
                window.location.reload();
            }
        } else {
            alert(error);
        }
    }

    return(
        <div className='inset-0 z-10 flex flex-col justify-center items-center w-[20rem] h-[20rem] m-auto'>
            <div>
                <h1 className='p-4 text-2xl'>Setup a verification code</h1>
            </div>  
            <div className='flex flex-col justify-center items-center p-2'>
                <p className="text-left p-2">Enter your verification code: </p>
                <input name="verification" disabled={disabled} type="password" onChange={handleChange} placeholder="Enter recovery code" className='rounded-lg p-2'/>
                <p className="text-left p-2">Confirm your verification code: </p>
                <input name="confirm" disabled={disabled} type="password" onChange={handleChange} placeholder="Confirm recovery code" className='rounded-lg p-2'/>
            </div>
            <div className='p-4'>
                <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-10 py-1 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} disabled={disabled} onClick={submit}>Submit</button>
            </div>
        </div>
    )
}