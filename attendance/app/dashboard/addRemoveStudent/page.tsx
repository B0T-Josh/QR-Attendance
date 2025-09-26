'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getSubjects,
  getStudentByTeacherSubject
} from "@/app/api/requests/request";
import ToggleSidebar from "@/components/ToggleSidebar";
import {verifyUser} from "@/app/api/requests/request"

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

type Uploaded = {
  student_id: string | null;
  name: string | null;
  subjects: string | null;
}

type Student = {
  id: string | null;
  student_id: string | null;
  name: string | null;
  subjects: string[] | [];
}

type Subject = {
  id: string | null;
  name: string | null;
}

export default function StudentRecords() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const ranOnce = useRef(false);
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    subjects: ""
  })
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [duplicatedError, setDuplicatedError] = useState<React.ReactElement | null>(null);
  const [students, setStudents] = useState<Students[]>([]);
  const [tempStudents, setTempStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [subjects, setSubjects] = useState<Subject[] | []>([]);

  //Handle inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
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
      const res = await getSubjects({id: id});
      if(res) {
        if(res.data.length > 0) {
          setSubjects(res.data || []);
        } else {
          setContent(<p className="text-yellow-500">{res.error}</p>);
          return;
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
          const {success} = await verifyUser();
          if (success) {
              setId(success);
          } else {
              route.push("/authPages/login");
          }
      }
      validate();
  }, []);

  //Resets the input values.
  function resetInput() {
    setStudent({
      ...student,
      student_id: "",
      name: "",
      subjects: ""
    });
  }

  //Handles search function 
  async function handleSearch() {
    setLoading(true);
    const studentList: Students[] | [] = tempStudents.filter((stud) => {
      return (
        (student.name.trim() === "" || stud.name.includes(student.name.trim())) &&
        (student.student_id.trim() === "" || stud.student_id === student.student_id) &&
        (student.subjects.trim() === "" || stud.subjects.includes(student.subjects.trim()))
      );
    });
    setStudents(studentList);
    setLoading(false);
  }

  //Reset content value.
  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
        setContent(null);
      }, 3000);
  }, [content]);

  //Set hide to navbar.
  function hide() {
      if(!hidden) {
          setHidden(true);
      } else {
          setHidden(false);
      }
  }

  return (
    <div className="flex">
      <div className="z-50">
          <ToggleSidebar onToggle={hide}/>
      </div>
      {hidden ? <div className="w-10"></div> : <Sidebar />}
      {loaded ? (
        <div className="flex flex-col items-center flex-1 p-8 gap-8">
          {loading ? (<p className="text-gray-300">Loading...</p>) : (<></>)}
          {duplicatedError}
          {content}
          <div className="w-full max-w-5xl p-4 flex flex-row border-b border-[#8d8a8a] items-center justify-between gap-4">
            <div className="ml-[7.7rem] flex items-center gap-4 flex-1">
              <input
                type="text"
                onChange={handleChange}
                placeholder="Enter student ID"
                className="p-2 rounded-lg"
                name="student_id"
                value={student.student_id}
              />

              <input
                type="text"
                onChange={handleChange}
                placeholder="SURNAME, Firstname M.I."
                className="p-2 rounded-lg"
                name="name"
                value={student.name}
              />

              <input
                type="text"
                onChange={handleChange}
                placeholder="Enter subject"
                className="p-2 rounded-lg"
                name="subjects"
                value={student.subjects}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between ">
            <button
              className="px-4 py-2 text-gray-600 hover:text-yellow-500"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-red-500"
              onClick={resetInput}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {/* Students Table */}
          <div className="w-full max-w-5xl rounded-lg overflow-auto">
            <table className="table-auto border-collapse border-[#8d8a8a] w-full">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Student ID</th>
                  <th className="border border-gray-400 px-4 py-2">Name</th>
                  <th className="border border-gray-400 px-4 py-2">Subject</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id} className="text-center">
                      <td className="border border-gray-400 px-4 py-2">{s.student_id}</td>
                      <td className="border border-gray-400 px-4 py-2">{s.name}</td>
                      <td className="border border-gray-400 px-4 py-2">{s.subjects.toString().replace(/,\s*/g, ", ")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
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