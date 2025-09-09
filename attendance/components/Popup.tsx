"use client";
import { useState } from 'react'

export default function setVerification() {
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
        <div className='display-flex justify-center h-screen'>
            <h2>Verififcation</h2>
        </div>
    )
}