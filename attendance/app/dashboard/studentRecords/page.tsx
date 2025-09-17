"use client";

import { useState, useEffect } from "react";
import Popup from "@/components/Popup"
import { getId } from "@/tools/getId"
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { validateTeacher } from "@/app/api/requests/request";

export default function Records() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false); 

  useEffect(() => {
      if(parseInt(getId() || '0') <= 0) {
          route.push("/authPages/login");
      }
      async function validate() {
        const {success} = await validateTeacher({id: localStorage.getItem("id")});
        if(!success) {
            localStorage.removeItem("id");
            route.push("/authPages/login");
        } 
        setLoaded(true);
      }
      validate();
  }, []);

  return (
    <div className="flex min-h-screen">
        <Sidebar />
    </div>
  );
}