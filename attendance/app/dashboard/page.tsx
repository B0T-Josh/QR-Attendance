"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup"

export function getId() {
  return localStorage.getItem('id');
}

export default function Dashboard() {
  const [verification, setVerification] = useState(true);
  const router = useRouter();
  
  let id: string; 

  function handleId() {
    id = getId() || "0";
  }

  async function handleData() {
    if(id === null || id === '0') return;
    const res = await fetch("/api/getVerification", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id})
    });
    if(res.ok) {
      const data = await res.json();
      if(data.verification) {
        setVerification(false);
      } else {
        setVerification(true);
      }
    }
    return res;
  }

  useEffect(() => {
    handleId();
    if(id === null) {
      alert("Unauthorized user. Log in first");
    } else {
      handleData();
    }
  }, []);

  let content;

  if(verification) {
    content = (
      <div className="border-2 rounded-lg">
        <button className="border w-5 h-8 rounded" onClick={() => {setVerification(false)}}>x</button>
        <Popup />
      </div>
      )
  } else {
    content = <p>Has verification</p>
  }

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center h-screen position-absolute">
      {content}
    </div>
  );

}
