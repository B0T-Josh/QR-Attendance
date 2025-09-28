'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  handleAddStudent,
  handleRemoveStudent,
  updateSubject,
  getStudents,
  verifyUser
} from "@/app/api/requests/request";
import format from "@/tools/format";
import ToggleSidebar from "@/components/ToggleSidebar";
import * as XLSX from 'xlsx';

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
  const [uploaded, setUploaded] = useState<Uploaded[] | []>([]);
  const [profile, setProfile] = useState<Student[] | []>([]);

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
    setLoaded(true);
  }, [students]);


  async function getAllStudents() {
    const res = await getStudents();
    setStudents(res.data || []);
  }

  useEffect(() => {
    getAllStudents();
  }, [id]);

  //Check if user is authorized.
  useEffect(() => {
    if(ranOnce.current) return;
    ranOnce.current = true;
    async function validate() {
      const {data} = await verifyUser();
      if(data) {
        if (data.admin === "true") {
          if(data.success) {
              setId(data.success);    
          }
        } else if(data.admin === "false") {
          if(data.success) {
              route.push("/dashboard/homePage");
          }
        } 
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

  //Handle add student
  async function handleAdd() {
    setLoading(true);
    if(profile.length > 0) {
      const { success, error } = await handleAddStudent(profile);
      if(success) {
        setLoading(false);
        setContent(<p className="text-green-300">Student is added</p>);
        resetInput();
        getAllStudents();
      } else {
        setLoading(false);
        setContent(<p className="text-red-500">{error}</p>);
      }
    }
    else {
      if(!student.student_id || !student.name || !student.subjects) {
        setLoading(false);
        setContent(<p className="text-red-500">All fields are required</p>);
        return;
      }
      const found = students.find(stud => student.student_id === stud.student_id);
      if(found) {
        setContent(<p className="text-red-500">Student already exists</p>);
        setLoading(false);
        return;
      } else {
        const subjArray = student.subjects ? student.subjects.split(",").map(sub => sub.trim().toUpperCase()) : [];
        const formatted = format(student.name.trim());
        if(!formatted) {
            setLoading(false);
            setContent(<p className="text-red-500">Invalid name format</p>);
        } else if(formatted.formatted) {
            const formattedName = formatted.formatted;
            const { success, error } = await handleAddStudent([{student_id: student.student_id, name: formattedName, subjects: subjArray}]);
            if(success) {
                setLoading(false);
                setContent(<p className="text-green-300">Student is added</p>);
                resetInput();
                getAllStudents();
            } else {
                setLoading(false);
                setContent(<p className="text-red-500">{error}</p>);
            }
            } else if(formatted.error) {
                setLoading(false);
                setContent(<p className="text-red-500">{formatted.error}</p>);
                return;
            }
      }
    }
  }

  //Handle remove function
  async function handleRemove() {
    setLoading(true);
    if (student.student_id) {
      const { success, error } = await handleRemoveStudent({ student_id: student.student_id });
      setLoading(false);
      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      resetInput();
      getAllStudents();
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
    if(student.student_id && student.subjects) {
      const found = students.find(stud => stud.student_id === student.student_id);
      if(!found) {
        setLoading(false);
        setContent(<p className="text-red-500">Student ID not found</p>);
        return;
      }
      const {success, error} = await updateSubject({student_id: student.student_id, subjects: student.subjects.split(",").map(sub => sub.trim().toUpperCase())});
      if(success) {
        resetInput();
        setLoading(false);
        setContent(<p className="text-green-300">{success}</p>);
        getAllStudents();
      } else {
        setLoading(false);
        setContent(<p className="text-green-300">{error}</p>);
      }
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result;
      if(!binaryString) return;

      const workbook = XLSX.read(binaryString, {type: "array"});
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const jsonData = XLSX.utils.sheet_to_json(workSheet || {}, {defval: null, raw: false, blankrows: false});
      setUploaded(jsonData as Uploaded[]);
    }
    reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    if(uploaded.length === 0) return;
    
    uploaded.map((data, index) => {
      if(!data.student_id) {
        setContent(<p className="text-red-500">Student ID is required {data.name ? (`for ${data.name}`) : (`for row ${index + 2}`)}</p>);
        return;
      }
      const formatted = format(data.name?.trim() || "");
      if(formatted) {
        if(formatted.formatted) {
          const subjectArray = data.subjects ? data.subjects.split(",").map(sub => sub.trim().toUpperCase()) : [];
          if(subjectArray.length === 0) {
            setContent(<p className="text-red-500">Subjects is required for student ID {data.student_id}</p>);
            return;
          }
          const duplicated = students.find(stud => {
            return (
              (stud.student_id === data.student_id) &&
              (stud.name === formatted.formatted) &&
              (stud.subjects.toString() === subjectArray.toString())
            );
          });
          if(duplicated) {
            setDuplicatedError(<p className="text-yellow-500">Student ID {data.student_id} is duplicated in the database</p>);
            setTimeout(() => {
              setDuplicatedError(null);
            }, 3000);
            return;
          } else {
            setProfile(prev => [...prev, {
              id: String(index+1),
              student_id: data.student_id,
              name: formatted.formatted,
              subjects: subjectArray
            }]);
          }
        }
        else if(formatted.error) {
          setContent(<p className="text-red-500">{formatted.error} for student ID {data.student_id}</p>);
          return;
        }
      }
      else {
        setContent(<p className="text-red-500">Name is required for student ID {data.student_id}</p>);
        return;
      }
    })
  }, [uploaded]);

  useEffect(() => {
    if(profile.length === 0) return;
    handleAdd();
  }, [profile]);

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

            <label htmlFor="upload"
            className="cursor-pointer text-gray-600 mt-3 hover:text-green-300">Choose File</label>

            <input className="hidden" id="upload" type="file" accept=".xlsx, .xls" onChange={handleUpload}/>
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