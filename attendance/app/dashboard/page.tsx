"use client";

import { useState, useEffect } from "react";
import { verificationFromUser } from "../api/endpoints";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup"

function getId() {
  return localStorage.getItem('id');
}

export default function Dashboard() {
  const [verification, setVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const router = useRouter();
  
  let id: string; 

  function handleId() {
    id = getId() || "0";
  }

  useEffect(() => {
    handleId();
    if(id === null) {
      alert("Unauthorized user. Log in first");
      return; 
    } else {
      fetch("/api/getVerification")
      .then(res => res.json())
      .then(data => setVerificationCode(data.verification));
      console.log(verificationCode);
    }
  }, []);

  let content;

  if(verification) {
    content = <Popup />
  } else {
    content = <p>Has verification</p>
  }

  return (
    <div>
      {content}
    </div>
  );

}
