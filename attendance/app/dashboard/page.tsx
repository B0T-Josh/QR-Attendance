"use client";

import { useState, useEffect } from "react";
import { getProfile } from "../api/endpoints";
import { useRouter } from "next/navigation";

function getId() {
    let id = localStorage.getItem("id");
    return id;
}

type Profile = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const id = getId();

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
