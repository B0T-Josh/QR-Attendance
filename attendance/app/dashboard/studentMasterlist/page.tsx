'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getSubjects,
  getStudentByTeacherSubject,
  verifyUser
} from "@/app/api/requests/request";

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
  year_level: number | 0;
};

type Subject = {
  id: string;
  name: string;
}

export default function StudentRecords() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const ranOnce = useRef(false);
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    subjects: "",
    year: ""
  })
  const [students, setStudents] = useState<Students[]>([]);
  const [tempStudents, setTempStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[] | []>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);

  //Handle inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    typeTimeout.current = setTimeout(() => {
      setStudent({
        ...student,
        [e.target.name]: e.target.name === "subjects" ? e.target.value.toUpperCase(): e.target.value
      });
    }, 1000);
  }

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
      setStudent({
        ...student,
        subjects: e.target.value
      });
    }

  //Makes a copy of students values after students got the value
  useEffect(() => {
    if(tempStudents.length > 0) return;
    setTempStudents(students);
  }, [students]);

  //Function to get all students related to user.
  async function getAllStudents() {
    const res = await getStudentByTeacherSubject({subjects: subjects.map(sub => sub.name || "")});
    setStudents(res.data || []);
  }

  //Get all student related to user.
  useEffect(() => {
    if(subjects.length === 0) return;
    getAllStudents();
  }, [subjects]);    

  //Validating and setting id for user
  useEffect(() => {
    if(!id) return;
    if(students.length > 0) return;
    async function getSubject() {
      const {data} = await getSubjects({id: id});
      if(data) {
        if(data.length > 0) {
          setSubjects(data || []);
        } 
      }
    }
    getSubject();
  }, [id]);

  useEffect(() => {   
    setLoaded(true);
  }, [students]);

  //Check if user is authorized.
  useEffect(() => {
    if(ranOnce.current) return;
    ranOnce.current = true;
    async function validate() {
      const {data} = await verifyUser();
      if(data) {
        if (data.admin === "false") {
          if(data.success) {
              setId(data.success);    
          }
        } else if(data.admin === "true") {
          if(data.success) {
              route.push("/adminDashboard/manageStudent");
          }
        } 
      } else {
        route.push("/authPages/login");
      }
    }
    validate();
  }, []);

  useEffect(() => {
    if(student.student_id.trim() === "" && student.name.trim() === "" && student.subjects.trim() === "" && student.year === "") {
      resetStudentList();
      return;
    }
    handleSearch()
  }, [student]);


  function resetStudentList() {
    setStudents(tempStudents);
  }

  //Handles search function 
  function handleSearch() {
    setLoading(true);
    const studentList: Students[] | [] = tempStudents.filter((stud) => {
      return (
        (student.name.trim() === "" || stud.name.toLowerCase().includes(student.name.trim().toLowerCase())) &&
        (student.student_id.trim() === "" || stud.student_id.trim() === student.student_id.trim()) &&
        (student.subjects.trim() === "" || stud.subjects.includes(student.subjects.trim())) &&
        (student.year === "" || stud.year_level == parseInt(student.year.trim()))
      );
    });
    console.log(studentList);
    setStudents(studentList);
    setLoading(false);
  }

  return (
    <div className="flex overflow-y-auto">
      <Sidebar />
      {loaded ? (
        <div className="flex flex-col items-center h-screen w-screen flex-1 gap-8 p-8">
          {loading ? (<p className="text-gray-300">Loading...</p>) : (<p>Student Masterlist</p>)}
          <div className="max-w-5xl p-4 border-b border-[#8d8a8a] flex flex-col items-center justify-center">
            <div className="flex flex-wrap items-center"> 
              <div className="flex flex-wrap justify-center gap-2">
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Enter Student ID"
                  className="p-2 m-1 rounded-lg bg-[#3B3B3B] ml-auto mr-auto placeholder-gray flex-[1_1] max-w-[15rem] min-w-[10rem] w-[15rem]"
                  name="student_id"
                />

                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="SURNAME, Firstname M.I."
                  className="p-2 m-1 rounded-lg bg-[#3B3B3B] ml-auto mr-auto placeholder-gray flex-[1_1] max-w-[15rem] min-w-[10rem] w-[15rem]"
                  name="name"
                />

                <select className="p-2 m-1 rounded-lg bg-[#3B3B3B] ml-auto mr-auto placeholder-gray flex-[1_1] max-w-[15rem] min-w-[10rem] w-[15rem]" value={student.subjects} name="subject" onChange={handleSelect}>
                  {subjects && subjects.length == 0 ? (null) : (<option value="">Select Subject</option>)}  
                  {subjects && subjects.length > 0 ? (
                    subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))
                  ) : <option value="">No subject</option>}
                </select>

                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Enter Year"
                  className="p-2 m-1 rounded-lg bg-[#3B3B3B] placeholder-gray ml-auto mr-auto flex-[1_1] min-w-[10rem] max-w-[15rem] w-[15rem]"
                  name="year"
                />
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="z-[1] w-full min-w-[5rem] max-w-6xl max-h-full min-h-3 rounded-lg overflow-auto border-2">
            <table className="table-auto border-collapse border-[#8d8a8a] h-full w-full">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Student ID</th>
                  <th className="border border-gray-400 px-4 py-2">Name</th>
                  <th className="border border-gray-400 px-4 py-2">Subject</th>
                  <th className="border border-gray-400 px-4 py-2">Year</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id} className="text-center">
                      <td className="border border-gray-400 px-4 py-2">{s.student_id}</td>
                      <td className="border border-gray-400 px-4 py-2">{s.name}</td>
                      <td className="border border-gray-400 px-4 py-2">{s.subjects.toString().replace(/,\s*/g, ", ")}</td>
                      <td className="border border-gray-400 px-4 py-2">{s.year_level}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border border-gray-400 px-4 py-2 text-center">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (<></>)}
    </div>
  );
}