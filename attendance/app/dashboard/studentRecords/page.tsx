"use client";

import { useState, useEffect, useRef } from "react";
import Popup from "@/components/Popup"
import { getId } from "@/tools/getId"
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getRecords, validateTeacher, getSubjects } from "@/app/api/requests/request";

type Record = {
  id: string;
  student_id: string;
  name: string;
  date: string;
  subject: string;
  time_in: string;
  time_out: string;
}

type Subjects = {
  id: string;
  name: string;
}

export default function Records() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false); 
  const [hasSubject, setHasSubject] = useState(false);
  const [record, setRecord] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<any>();
  const [search, setSearch] = useState({
    id: null,
    name: null,
    subject: null,
    date: null
  });
  const [subjects, setSubjects] = useState<Subjects[]>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);

  async function getRecord() {
    setLoading(true);
    const {data, error} = await getRecords({data: search});
    setRecord(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    typeTimeout.current = setTimeout(() => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value
      });
    }, 500);
  }

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
        setId(localStorage.getItem("id"));
        setLoaded(true);
      }
      validate();
  }, []);

  useEffect(() => {
    if(!(search.date || search.id || search.name || search.subject)) return;
    setLoading(true);
    if(search.subject) {
      async function getSubject() {
        const res = await getSubjects({id: id});
        setSubjects(res.data || []);
      }
      getSubject();
    } else {
      getRecord();
    }
  }, [search]);

  useEffect(() => {
    if(hasSubject) {
      getRecord();
    }
  }, [hasSubject]);

  useEffect(() => {
    if(subjects.length > 0) {
      const found = subjects.find(items => items.name === search.subject);
      console.log(found);
      if(!found?.name) {
        setHasSubject(false);
        setLoading(false);
        setContent(<p className="text-red-500">You don't have this subject</p>);
        setTimeout(() => {
          setContent("");
        }, 2000);
      } else {
        setHasSubject(true);
        setLoading(false);
      }
    }
  }, [subjects]);

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        {loaded ? (
          <div className="p-4 flex justify-center items-center m-auto">
            <div className="mt-auto mb-auto p-4  w-[20rem] h-auto">
                {content}
                {loading ? (<h2 className="p-2">Loading</h2>) : <h2 className="p-2">Search</h2>}
                <input type="text" name="subject" onChange={handleChange} placeholder="Enter subject" className="p-2 bg-transparent"/>
                <input type="text" name="date" onChange={handleChange} placeholder="Enter date" className="p-2 bg-transparent"/>
                <input type="text" name="id" onChange={handleChange} placeholder="Enter student id" className="p-2 bg-transparent"/>
                <input type="text" name="name" onChange={handleChange} placeholder="Enter student name" className="p-2 bg-transparent"/>
            </div>
          <div className="border-2 rounded-lg">
              <table className="table-auto border-collapse border border-gray-400 w-full h-full">
                  <thead>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2">ID</th>
                        <th className="border border-gray-400 px-4 py-2">Student ID</th>
                        <th className="border border-gray-400 px-4 py-2">Student Name</th>
                        <th className="border border-gray-400 px-4 py-2">Subject</th>
                        <th className="border border-gray-400 px-4 py-2">Date</th>
                        <th className="border border-gray-400 px-4 py-2">Time In</th>
                        <th className="border border-gray-400 px-4 py-2">Time Out</th>
                      </tr>
                  </thead>
                  <tbody>
                      {record?.length > 0 ? (
                        record.map((rec) => (
                        <tr key={rec.id} className="text-center">
                            <td className="border border-gray-400 px-4 py-2">{rec.id}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.student_id}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.name}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.subject}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.date}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.time_in}</td>
                            <td className="border border-gray-400 px-4 py-2">{rec.time_out}</td>
                        </tr>
                        ))
                      ) : (
                      <tr>
                        <td colSpan={7} className="border border-gray-400 px-4 py-2 text-center">
                          No subjects found
                        </td>
                      </tr>
                  )}
                  </tbody>
              </table>
          </div>
        </div>
        ) : <p></p>}
    </div>
  );
}