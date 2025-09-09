"use client";
import { useState } from 'react'

export default function Popup() {
    const [profile, setProfile] = useState({
        email: null,
        verification: null
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setProfile(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    return(
        <div className='flex flex-col justify-center w-[60rem] h-[80rem] border-2 rounded-lg'>
            <div className='m-auto border-2 w-[40rem]'>

            </div>
        </div>
    )
}