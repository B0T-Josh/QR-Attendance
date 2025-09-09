"use client";

import { useState, useEffect } from "react";
import { getVerification } from "../api/endpoints";
import { useRouter } from "next/navigation";

function getId() {
    let id = localStorage.getItem("id");
    return id;
}

export default function Dashboard() {
  const [verification, setVerification] = useState(false);
  const router = useRouter();
  const id = getId();

  useEffect(() => {
    if (id === null) {
      router.push('/authPages/login');
      return;
    }
    const fetchData = async () => {
      const data = await getVerification(parseInt(id));
        if (data === null) {
            setVerification(true);
        }
    };
    fetchData();
  }, [id]);

  

  return (
  <div>
    
  </div>
);

}
