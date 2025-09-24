"use client";
import { useState, useEffect } from 'react';
import { verifyUser } from '@/app/api/requests/request';
import encryptPassword from '../tools/encrypt';

export default function Popup() {
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verification, setVerification] = useState<{
        verification: string | null;
        confirm: string | null;
        id: string | null;
    }>({
        verification: "",
        confirm: "",
        id: ""
    });
    const [id, setId] = useState<String | null>(null);

    //set Id for verification
    useEffect(() => {
        
        setLoaded(true);

        async function validate() {
            const {success} = await verifyUser();
            if (success) {
                setVerification({
                    ...verification,
                    id: success.id
                });
            }
        }
        validate();
    }, []);

    //Handle code input and encryption.
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVerification(prev => ({
            ...prev,
            [e.target.name]: encryptPassword(e.target.value)
        }));
    }

    //Handle submit code.
    async function submit() {
        setLoading(true);
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
                setLoading(false);
                window.location.reload();
            }
        } else {
            setLoading(false);
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
                <input name="verification" type="password" onChange={handleChange} placeholder="Enter recovery code" className='rounded-lg p-2'/>
                <p className="text-left p-2">Confirm your verification code: </p>
                <input name="confirm" type="password" onChange={handleChange} placeholder="Confirm recovery code" className='rounded-lg p-2'/>
            </div>
            <div className='p-4'>
                <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-10 py-1 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} disabled={loading} onClick={submit}>Submit</button>
            </div>
        </div>
    )
}