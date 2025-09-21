'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import {
  handleAddStudent,
  handleRemoveStudent,
  getStudents,
  getStudent,
  validateTeacher
} from "@/app/api/requests/request";
import format from "@/tools/format";

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

export default function StudentRecords() {
  const route = useRouter();
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    subjects: ""
  })
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [students, setStudents] = useState<Students[]>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  const name_input = useRef<HTMLInputElement | null>(null);
  const id_input = useRef<HTMLInputElement | null>(null);
  const subject_input = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  }

  const get = async () => {
    const res = await getStudents();
    setStudents(res.data || []);
  };

  useEffect(() => {
    if((student.name === "" && student.student_id === "" && student.subjects === "")) get();
  }, [student])

  useEffect(() => {
      if(parseInt(getId() || '0') <= 0) {
          route.push("/authPages/login");
      }
      async function validate() {
          const {success} = await validateTeacher({uid: localStorage.getItem("id")});
          if(success) {
              setId(getId());
          } else {
              localStorage.removeItem("id");
              route.push("/authPages/login");
          }
      }
      validate();
  }, []);

  async function handleAdd() {
    setLoading(true);
    if (student.name && student.student_id && student.subjects) {
      const formatted = format(student.name);
      if(formatted?.error) {
        setContent(<p className="text-red-500">Invalid format.<br/>Must be SURNAME, Firstname M.I.</p>);
        return;
      }
      const { success, error } = await handleAddStudent({
        student_id: student.student_id,
        name: formatted?.formatted,
        subjects: student.subjects
      });

      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      name_input.current && (name_input.current.value = "");
      id_input.current && (id_input.current.value = "");
      subject_input.current && (subject_input.current.value = "");
      get();
      setLoading(false);
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Fill all fields first</p>);
    }
  }

  async function handleRemove() {
    setLoading(true);
    if (student.student_id) {
      const { success, error } = await handleRemoveStudent({ student_id: student.student_id });
      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      name_input.current && (name_input.current.value = "");
      id_input.current && (id_input.current.value = "");
      subject_input.current && (subject_input.current.value = "");
      get();
      setLoading(false);
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Enter student ID to remove</p>);
    }
  }

    function handleName(e: React.ChangeEvent<HTMLInputElement>) {
        if(typeTimeout.current) {
          clearTimeout(typeTimeout.current);
        }
        typeTimeout.current = setTimeout(() => {
          const formatted = format(e.target.value);
          if(formatted?.formatted) {
            setStudent({
              ...student,
              name: formatted.formatted,
            });
          } else {
            setContent(<p className="text-red-500">{formatted?.error}</p>);
          }
        }, 1000);
    };

  async function handleSearch() {
    setLoading(true);
    if((student.student_id === "" && student.name === "" && student.subjects === "")) {
      setContent(<p className="text-red-500">Enter a value first</p>);
      setLoading(false);
      return;
    }
    const {data, error} = await getStudent({student_id: student.student_id, name: student.name, subjects: student.subjects});
    if(data) {
      setStudents(data || []);
      setLoading(false);
    } else {
      setContent(<p className="text-red-500">{error}</p>);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(content === "") return;
    setTimeout(() => {
        setContent("");
      }, 2000);
  }, [content]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center flex-1 p-8 gap-8">
        {content}
        <div className="w-full max-w-5xl p-4 flex flex-row border-b border-[#8d8a8a] items-center justify-between gap-4">
          <div className="ml-[7.7rem] flex items-center gap-4 flex-1">
            {/* <label className="block mb-2">Enter Student ID:</label> */}
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter student ID"
              className="p-2 rounded-lg"
              name="student_id"
              ref={id_input}
            />

            {/* <label className="block mb-2">Enter Student Name:</label> */}
            <input
              type="text"
              onChange={handleName}
              placeholder="Enter student name"
              className="p-2 rounded-lg"
              name="name"
              ref={name_input}
            />

            {/* <label className="block mb-2">Enter Subject:</label> */}
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter subject"
              className="p-2 rounded-lg"
              name="subjects"
              ref={subject_input}
            />
            
            
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd}>
              Add
          </button>

          <button
            className="px-4 py-2 text-gray-600 hover:text-yellow-500"
            onClick={handleSearch}
          >
            Search
          </button>

          <button
            className="px-4 py-2 text-gray-600 hover:text-red-500"
            onClick={handleRemove}
          >
            Remove
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
                    <td className="border border-gray-400 px-4 py-2">{s.subjects}</td>
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
    </div>
  );
}