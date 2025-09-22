"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { getId } from "@/tools/getId"
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getAllRecords, getRecords, validateTeacher, getSubjects } from "@/app/api/requests/request";
import format from "@/tools/format";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";

type Record = {
  id: string | null | undefined;
  student_id: string | null | undefined;
  name: string | null | undefined;
  date: string | null | undefined;
  subject: string | null | undefined;
  time_in: string | null | undefined;
  time_out: string | null | undefined;
}

type RecordList = Record & {attendance: string | null | undefined};

type Subjects = {
  id: string;
  name: string;
}

type Attendance = {
  id: string | null | undefined;
  attendance: string| null | undefined;
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
  const [attendance, setAttendance] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subjects[] | null>(null);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [attendees, setAttendees] = useState<Attendance[] | []>([]);
  const [recordList, setRecordList] = useState<RecordList[] | []>([]);
  const [tempRecord, setTempRecord] = useState<RecordList[] | []>([]);

  useEffect(() => {
    if (!record) return;
    const studentAttendance: Attendance[] = record.map(items => ({
      id: items.id,
      attendance: items.time_out ? "Present" : "Absent"
    }));
    setAttendees(studentAttendance);
  }, [record]);

  useEffect(() => {
    if(tempRecord.length > 0) return;
    setTempRecord(recordList);
  }, [recordList]);

  function refreshRecord() {
    setRecordList(tempRecord);
  }

  useEffect(() => {
    if(!attendees) return;
    const students: RecordList[] = record.map(item => ({
      ...item,
      attendance: attendees.find((stud_id) => stud_id.id === item.id) ? attendees.find((stud_id) => stud_id.id === item.id)?.attendance : "",
    }));
    setRecordList(students);
  }, [attendees]);

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

  function handleAttendees(e: ChangeEvent<HTMLSelectElement>) {
    setAttendance(e.target.value);
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
    if(!(search.date || search.student_id || search.name || search.subject)) {
      if(tempRecord.length == 0) {
        async function getRecords() {
          const {data, error} = await getAllRecords({subjects: subjects});
          if(data) {
            setRecord(data);
            setLoading(false);
          } else {
            setContent(<p className="text-red-500">{error}</p>);
            setLoading(false);
          }
        }
        getRecords();
      }
      refreshRecord();
      setLoading(false);
    }    
    if(search.name === "" && search.subject === "" && search.student_id === "" && search.date === "" && attendance === "") {
      refreshRecord();
      return;
    }
    const studentList: RecordList[] = tempRecord.filter((att) => {
      return (
        (search.subject === "" || att.subject === search.subject) &&
        (attendance === "" || att.attendance === attendance) &&
        (search.date === "" || att.date?.trim() === search.date.trim()) &&
        (search.name === "" || att.name?.includes(search.name.trim())) &&
        (search.student_id === "" || att.student_id?.includes(search.student_id.trim()))
      );
    });

    setRecordList(studentList);
  
  }, [search, attendance]);

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
    if(attendance === "") {
      const students: RecordList[] = record.map(item => ({
        ...item,
        attendance: attendees.find((stud_id) => stud_id.id === item.id) ? attendees.find((stud_id) => stud_id.id === item.id)?.attendance : "",
      }));
      setRecordList(students);
    } else {
      const studentList: RecordList[] = recordList.filter((item) => item.attendance === attendance);
      setRecordList(studentList);
    }
  }, [attendance]);

  useEffect(() => {
    if(!subjects) return;
    async function getRecords() {
      const {data, error} = await getAllRecords({subjects: subjects});
      if(data) {
        setRecord(data);
        setLoading(false);
      } else {
        setContent(<p className="text-red-500">{error}</p>);
        setLoading(false);
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
    <div className="flex min-h-screen min-w-screen">
      <Sidebar />
      {loaded ? (
        <div className="p-4 flex flex-col justify-center items-center m-auto">
          {content}
          <div className="w-full max-w-5xl py-4 border-b border-[#c7c7c79f] flex flex-row gap-4 items-center">
            {loading ? (
              <h2 className="p-2 font-medium">Loading...</h2>
            ) : (
              <h2 className="p-2 font-medium">Search:</h2>
            )}

            <select className="p-2 rounded-lg w-[12rem]" name="attendance" value={attendance || ""} onChange={handleAttendees}>
              <option value="">Select attendance</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

            <select
              className="p-2 rounded-lg w-[12rem]"
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
              className="p-1.5 rounded-lg w-[12rem]"
            />

            <input
              type="text"
              name="student_id"
              onChange={handleChange}
              placeholder="Enter student ID"
              className="p-2 rounded-lg w-[12rem]"
            />

            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Enter student name"
              className="p-2 rounded-lg w-[12rem]"
            />
            
          </div>
          <div className="mt-4 border border-[#c7c7c79f] rounded-lg max-h-[550px] overflow-auto">
              <table className="table-auto border-collapse w-[65rem]">
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
                    {recordList?.length > 0 ? (
                      recordList.map((rec) => (
                      <tr key={rec.id} className="text-center">
                          <td className="border border-gray-400 px-4 py-2">{rec.id}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.student_id}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.name}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.subject}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.date}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.time_in}</td>
                          <td className="border border-gray-400 px-4 py-2">{rec.time_out}</td>
                          <td className="border border-gray-400 px-4 py-2 flex justify-center items-center">
                            {rec.attendance === "Present" ? 
                            <IoCheckmarkCircle color="#27B757" size={24} />
                            : 
                            <IoCloseCircle color="#B62424" size={24} />
                            }
                          </td>
                      </tr> 
                      ))
                    ) : (
                    <tr>
                      <td colSpan={8} className="border border-gray-400 px-4 py-2 text-center">
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