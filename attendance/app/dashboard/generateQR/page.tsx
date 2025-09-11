'use client';

import Sidebar from "@/components/Sidebar";
import QRGenerator from "@/components/QRGenerator";

export default function StudentRecords() {
    return (
        <div>
            <Sidebar />
            <QRGenerator />
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