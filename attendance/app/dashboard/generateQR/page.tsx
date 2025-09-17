'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";
import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getId } from "@/tools/getId"
import { validateTeacher } from "@/app/api/requests/request";

export default function StudentRecords() {
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
        <div className="flex">
            <div className="z-50">
                <Sidebar />
            </div>
            
            {loaded ? (
                <div>
                    <QRGenerator />
                </div>
            ) : <p></p>}
            
        </div>
    );
}


useEffect(() => {
    if (id === null) {
      router.push('/authPages/login');
      return;
    }

    const fetchData = async () => {
      const data = await getProfile(parseInt(id));
        if (data === null) {
            alert("Unauthorized user");
            router.push("/authPages/login");
        } else {
            const profiles = Array.isArray(data[0]) ? data[0] : data;
            setProfiles(profiles as Profile[]);
        }
    };


must use this format when getting data from supabase

    fetchData();
  }, [id, router]);

  return (
  <div>
    {profiles.length > 0 ? (
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            ID: {profile.id}, Name: {profile.name}
          </li>
        ))}
      </ul>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

}