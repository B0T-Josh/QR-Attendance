"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { getId } from "@/tools/getId"
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getAllRecords, getRecords, validateTeacher, getSubjects } from "@/app/api/requests/request";
import format from "@/tools/format";

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
  const [record, setRecord] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [search, setSearch] = useState({
    student_id: "",
    name: "",
    subject: "",
    date: ""
  });
  const [subjects, setSubjects] = useState<Subjects[] | null>(null);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    typeTimeout.current = setTimeout(() => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value.trim()
      });
    }, 1000);
  }

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      subject: e.target.value
    });
  }

  useEffect(() => {
      if(parseInt(getId() || '0') <= 0) {
          route.push("/authPages/login");
      }
      async function validate() {
        const {success} = await validateTeacher({uid: localStorage.getItem("id")});
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
    if(!(search.date || search.student_id || search.name || search.subject)) return;
    setLoading(true);
    if(search.name) {
      const formatted = format(search.name);
      if(formatted) {
        if(formatted.formatted) {
          const name = formatted?.formatted;
          async function getSelectedRecord() {
            const {data, error} = await getRecords({student_id: search.student_id, name: name, subjects: search.subject, date: search.date});
            if(data) {
              setRecord(data);
              setLoading(false);
            } else {
              setContent(<p className="text-red-500">{error}</p>);
              setLoading(false);
            }
          }
          getSelectedRecord();
        } else if(formatted.error) {
            setContent(<p className="text-red-500">{formatted.error}</p>);
            setLoading(false);
            return;
        }
      }
    } else {
      async function getSelectedRecord() {
        const {data, error} = await getRecords({student_id: search.student_id, name: search.name, subjects: search.subject, date: search.date});
        if(data) {
          setRecord(data);
          setLoading(false);
        } else {
          setContent(<p className="text-red-500">{error}</p>);
          setLoading(false);
        }
      }
      getSelectedRecord();
    }
    
  }, [search]);

  useEffect(() => {
    if(!id) return;
    if(!subjects) {
      async function getSubject() {
        const res = await getSubjects({id: id});
        setSubjects(res.data || []);
      }
      getSubject();
    }
  }, [id]);

  useEffect(() => {
    if(!subjects) return;
    async function getRecords() {
      const {data, error} = await getAllRecords({subjects: subjects});
      if(data) {
        setRecord(data);
      } else {
        setContent(<p className="text-red-500">{error}</p>);
      }
    }
    getRecords();
  }, [subjects]);

  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
      setContent(null);
    }, 2000);
  }, [content])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {loaded ? (
        <div className="p-4 flex flex-col justify-center items-center m-auto">
          <div className="w-full max-w-5xl p-4 border-b border-[#c7c7c79f] flex flex-wrap gap-4 items-center">
            {loading ? (
              <h2 className="p-2 font-medium">Loading...</h2>
            ) : (
              <h2 className="p-2 font-medium">Search</h2>
            )}

            <select
              className="p-2 rounded-lg"
              value={search.subject}
              name="subject"
              onChange={handleSelect}
            >
              <option value="">Select a subject</option>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))
              ) : (
                <option value="">No subject</option>
              )}
            </select>

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="p-2 rounded-lg"
            />

            <input
              type="text"
              name="student_id"
              onChange={handleChange}
              placeholder="Enter student id"
              className="p-2 rounded-lg"
            />

            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Enter student name"
              className="p-2 rounded-lg"
            />
          </div>
          <div className="mt-4 border border-[#c7c7c79f] rounded-lg overflow-hidden">
              <table className="table-auto border-collapse w-full h-full">
                <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">ID</th>
                      <th className="border border-gray-400 px-4 py-2">Student ID</th>
                      <th className="border border-gray-400 px-4 py-2">Student Name</th>
                      <th className="border border-gray-400 px-4 py-2">Subject</th>
                      <th className="border border-gray-400 px-4 py-2">Date</th>
                      <th className="border border-gray-400 px-4 py-2">Time In</th>
                      <th className="border border-gray-400 px-4 py-2">Time Out</th>
                      <th className="border border-gray-400 px-4 py-2">Attendance</th>
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
                          <td className="border border-gray-400 px-4 py-2">{rec.time_out ? (<p className="text-green-300">Present</p>) : (<p className="text-red-500">Absent</p>) }</td>
                      </tr>
                      ))
                    ) : (
                    <tr>
                      <td colSpan={7} className="border border-gray-400 px-4 py-2 text-center">
                        No data found
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