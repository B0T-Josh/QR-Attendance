'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  handleAddStudent,
  handleRemoveStudent,
  verifyStudent,
  getStudentByTeacherID,
  updateSubject
} from "@/app/api/requests/request";
import format from "@/tools/format";
import ToggleSidebar from "@/components/ToggleSidebar";
import {verifyUser} from "@/app/api/requests/request"

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

export default function StudentRecords() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    subjects: ""
  })
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [students, setStudents] = useState<Students[]>([]);
  const [tempStudents, setTempStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

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

  //Get the students that are inserted by the user.
  async function getStudentById() {
    const res = await getStudentByTeacherID({teacher_id: id});
    setStudents(res.data || []);
  }

  //Executes getStudentById() after it got the id value of the user.
  useEffect(() => {
    if(!id) return;
    if(students.length > 0) return;
    getStudentById();
  }, [id]);

    useEffect(() => {
        setLoaded(true);
    }, []);

    //Check if user is authorized.
    useEffect(() => {
        async function validate() {
            const {success} = await verifyUser();
            if (success) {
                setId(success);
            } else {
                route.push("/authPages/login");
            }
        }
        validate();
    }, [loaded]);


  //Resets the input values.
  function resetInput() {
    setStudent({
      ...student,
      student_id: "",
      name: "",
      subjects: ""
    });
  }

  //Handle add student
  async function handleAdd() {
    setLoading(true);
    if (student.name && student.student_id && student.subjects) {
      const formatted = format(student.name.trim());
      //Check if there is a return value.
      if(formatted) {
        if(formatted?.error) {
          setLoading(false);
          setContent(<p className="text-red-500">{formatted?.error}</p>);
        }
        //If formatted name is valid, execute this block.
        if(formatted.formatted) {
          const { exist, empty } = await verifyStudent({student_id: student.student_id, teacher_id: id});
          if(empty) {
            const { success, error } = await handleAddStudent({
              student_id: student.student_id,
              name: formatted.formatted,
              subjects: student.subjects.toUpperCase(),
              teacher_id: id
            });
            if(success) {
              setLoading(false);
              setContent(<p className="text-green-300">Student is added</p>);
              resetInput();
              getStudentById();
            } else {
              setLoading(false);
              setContent(<p className="text-red-500">{error}</p>);
            }
          } else if(exist) {
            resetInput();
            setLoading(false);
            setContent(<p className="text-red-500">Student exist</p>);
          }
        }
      }
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Fill all fields first</p>);
    }
  }

  //Handle remove function
  async function handleRemove() {
    setLoading(true);
    if (student.student_id) {
      const { success, error } = await handleRemoveStudent({ student_id: student.student_id, teacher_id: id });
      setLoading(false);
      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      resetInput();
      getStudentById();
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Enter student ID to remove</p>);
    }
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

  //Handle update function
  async function handleUpdate() {
    setLoading(true);
    if(student.student_id && student.subjects && id) {
      const {success, error} = await updateSubject({student_id: student.student_id, teacher_id: id, subjects: student.subjects});
      if(success) {
        resetInput();
        setLoading(false);
        setContent(<p className="text-green-300">{success}</p>);
        getStudentById();
      } else {
        setLoading(false);
        setContent(<p className="text-green-300">{error}</p>);
      }
    }
  }

  //Reset content value.
  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
        setContent(null);
      }, 2000);
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

          <div className="flex flex-row justify-between">
            <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd} disabled={loading}>
                Add
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-yellow-500"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-red-500"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-green-300"
              onClick={handleUpdate}
              disabled={loading}
            >
              Update
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
      ) : (<></>)}
    </div>
  );
}