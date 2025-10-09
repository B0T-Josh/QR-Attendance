"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getSubjects, getAllRecords, verifyUser } from "@/app/api/requests/request";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

type Record = {
  id: string | null | undefined;
  student_id: string | null | undefined;
  name: string | null | undefined;
  date: string | null | undefined;
  subject: string[] | [];
  time_in: string | null | undefined;
  time_out: string | null | undefined;
  year_level: number | 0;
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
  const ranOnce = useRef(false); 
  const [loaded, setLoaded] = useState(false); 
  const [record, setRecord] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [search, setSearch] = useState({
    student_id: "",
    name: "",
    subject: "",
    date: "",
    year: ""
  });
  const [attendance, setAttendance] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subjects[] | null>(null);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [attendees, setAttendees] = useState<Attendance[] | []>([]);
  const [recordList, setRecordList] = useState<RecordList[] | []>([]);
  const [tempRecord, setTempRecord] = useState<RecordList[] | []>([]);
  const [subjectNames, setSubjectNames] = useState<string[] | []>([]);

  //Evaluate if the student is present or not and set the attendees to the value returned.
  useEffect(() => {
    if (!record) return;
    const studentAttendance: Attendance[] = record.map(items => ({
      id: items.id,
      attendance: items.time_out ? "Present" : "Absent"
    }));
    setAttendees(studentAttendance);
  }, [record]);

  //Sets a remporary record list for record list refresh.
  useEffect(() => {
    if(tempRecord.length > 0) return;
    setTempRecord(recordList);
  }, [recordList]);

  //Refresh record list values.
  function refreshRecord() {
    setRecordList(tempRecord);
  }

  //Sets record list value after attendees is set.
  useEffect(() => {
    if(!attendees) return;
    const students: RecordList[] = record.map(item => ({
      ...item,
      attendance: attendees.find((stud_id) => stud_id.id === item.id) ? attendees.find((stud_id) => stud_id.id === item.id)?.attendance : "",
    }));
    setRecordList(students);
  }, [attendees]);

  //Handle input.
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

  //Handle attendance input
  function handleAttendees(e: ChangeEvent<HTMLSelectElement>) {
    setAttendance(e.target.value);
  }

  //Handle subject input.
  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      subject: e.target.value
    });
  }

  async function handleExport() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Student Records");

    const header = sheet.addRow(["ID", "Student ID", "Student Name", "Year Level", "Subject", "Date", "Time In", "Time Out", "Attendance"]);
    header.font = {bold: true};
    header.alignment = {horizontal: "center"};

    recordList.forEach((rec) => {
      const row = sheet.addRow([rec.id, rec.student_id, rec.name, rec.year_level, rec.subject?.join(", "), rec.date, rec.time_in, rec.time_out, rec.attendance]);
      row.alignment = {horizontal: "center"};
      row.getCell(9).font = rec.attendance === "Present" ? {color: {argb: "FF27B757"}} : {color: {argb: "FFB62424"}};
    })

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    saveAs(blob, "Student Records.xlsx");
  }

  //Set loaded to true on the initial render.
  useEffect(() => {   
      setLoaded(true);
  }, [record]);

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

  //Filter function.
  useEffect(() => {
    if(search.name === "" && search.subject === "" && search.student_id === "" && search.date === "" && !attendance && search.year === "") {
      refreshRecord();
      return;
    }
    const studentList: RecordList[] = tempRecord.filter((att) => {
      return (
        (search.subject === "" || att.subject[0] === search.subject) &&
        (!attendance || att.attendance === attendance) &&
        (search.date === "" || att.date?.trim() === search.date.trim()) &&
        (search.name === "" || att.name?.includes(search.name.trim())) &&
        (search.student_id === "" || att.student_id?.includes(search.student_id.trim())) &&
        (search.year === "" || att.year_level == parseInt(search.year))
      );
    });
    if(studentList.length === 0) {
      setContent(<p className="text-red-500 p-2">No record found</p>);
    } else {
      setRecordList(studentList);
    }
  }, [search, attendance]);

  //Fetches all records that are related to the prof. 
  useEffect(() => {
    if(subjects?.length === 0) return;
    setSubjectNames(subjects?.map(sub => sub.name) || []);
  }, [subjects]);

  useEffect(() => {
    if(subjectNames.length === 0) return;
    async function getAll() {
      const res = await getAllRecords({subjects: subjectNames});
      const data: Record[] | [] = res.data;
      if(data.length > 0) {
        setRecord(data);
      }
    }
    getAll();
    setLoading(false);
  }, [subjectNames]);

  //Get all subjects after id was set.
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

  //Reset content value.
  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
      setContent(null);
    }, 2000);
  }, [content]);

  return (
    <div className="flex min-h-screen min-w-screen">
      <Sidebar />
      {loaded ? (
        <div className="p-4 flex flex-wrap m-auto">
          {content}
          <div className="w-full max-w-8xl py-4 border-b border-[#c7c7c79f] flex">
            {loading ? (
              <h2 className="p-2 font-medium">Loading...</h2>
            ) : (
              <h2 className="p-2 font-medium">Search:</h2>
            )}
            <div className="flex flex-wrap justify-center">
              <select className="p-2 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]" name="attendance" value={attendance || ""} onChange={handleAttendees}>
                <option value="">Select attendance</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>

              <select
                className="p-2 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]"
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
                className="p-1.5 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]"
              />

              <input
                type="text"
                name="student_id"
                onChange={handleChange}
                placeholder="Enter student ID"
                className="p-2 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]"
              />

              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Enter student name"
                className="p-2 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]"
              />

              <input
                type="text"
                name="year"
                placeholder="Enter course year"
                onChange={handleChange}
                className="p-2 m-1 rounded-lg min-w-[1rem] bg-[#3B3B3B] placeholder-gray flex-[1_0_1rem]"
              />
              
              <button className="px-4 text-gray-600 hover:text-green-500 " onClick={handleExport}>
                Export
              </button>
            </div>

            

          </div>
          <div className="w-full mt-4 border-2 rounded-lg max-h-[550px] overflow-auto flex flex-wrap">
            <table className="w-full table-auto border-collapse w-[65rem] flex-[1_2_1rem]">
              <thead className="sticky top-0 bg-[#222222]">
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">ID</th>
                    <th className="border border-gray-400 px-4 py-2">Student ID</th>
                    <th className="border border-gray-400 px-4 py-2">Student Name</th>
                    <th className="border border-gray-400 px-4 py-2">Year</th>
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
                        <td className="border border-gray-400 px-4 py-2">{rec.year_level}</td>
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
                    <td colSpan={9} className="border border-gray-400 px-4 py-2 text-center">
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