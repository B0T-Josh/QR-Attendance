
import { createClient } from '@supabase/supabase-js';

const url = 'https://ubtgylbwwffsjxlnmxdu.supabase.co';
const key = 'sb_publishable_f44KRWBKnwS3LG4pMhPTgg_27eY9xrJ';
const supabase = createClient(url, key);

// Gets the time when the QR was scanned 
function getTime() {
    const date = new Date();
    const time =
        String(date.getHours()).padStart(2, "0") + ":" +
        String(date.getMinutes()).padStart(2, "0") + ":" +
        String(date.getSeconds()).padStart(2, "0");
    return time; 
}

//Gets the time when the QR was scanned
function getDate() {
    const date = new Date();
    const formatted = date.toISOString().split("T")[0];
    return formatted;
}

type Student = {
    name: string;
    student_id: string;
    subjects: string;
}

type Professor = {
    id: string;
    name: string;
}

type Account = {
    id: string;
    email: string;
    password: string;
    name: string;
}

//Comes from the resgistration page. This adds the teacher's account to the database.
export async function addUser(info: Account) {

    try{
        const { error } = await supabase.from('account').insert([{email: info.email, password: info.password}]);
        if(error) {
            return ({error: "Email address already exist"});
        }
        const { data: prof, error: err } = await supabase.from('account').select('id').eq('email', info.email).single();
        if(err) {
            return({error: "There is an error fetching id"});
        }
        if(await addTeacher(prof.id, info.name)){
            return ({success: "Profile was successfully created"});
        } else return ({error: "Creating profile failed"});
    } catch (error) {
        return ({error: "Server error"});
    }
}

//Adds the name of the teacher to the teacher table from the database.
export async function addTeacher(id: string, name: string) {
    try {
        const { error: err } = await supabase.from('teacher').insert([{id: id, name: name}]);
        if(err) {
            return false;
        }else return true;
    } catch (error) {
        return false;
    }
}

//Checks if the verification code exist from account table.
export async function getVerification(id: string) {
    try {
        const { data } = await supabase.from('account').select('verification').eq('id', id).single();
        return ({verification: data?.verification});
    } catch (error) {
        return ({error: "There is no verification code"});
    }
}

//Adds attendance record for students aftter scanning the QR.
export async function addRecord(info: Student) {
    try {
       if(await validateSubject(info.subjects)) {
        await supabase.from('attendance').insert({student_id: info.student_id, name: info.name, subject: info.subjects, time_in: getTime()});
        return ({success: "Attendance recorded for " + info.name});
       } else {
        return({error: "Failed to record attendance. Student " + info.name});
       }
    } catch(error) {
        return({error: error});
    }
}

//Validates the subject that the teacher/professor inputs 
async function validateSubject(subject: string) {
    const {data} = await supabase.from("subject").select("id").eq("name", subject).single();
    if(data) {
        return true;
    } else {
        return false;
    }
}

//Adds verification code to the user's account.
export async function addVerification(verification: string, id: string) {
    try {
        await supabase.from('account').update({verification: verification}).eq('id', id);
        return true;
    } catch(error) {
        return false;
    }
}

//Adds time out to the student's record.
export async function timeOut(info: Student) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("time_out").eq("date", formatted).eq("student_id", info.student_id).eq("subject", info.subjects).single();
    if(data?.time_out === null) {
        await supabase.from('attendance').update({time_out: getTime()}).eq("date", formatted).eq("student_id", info.student_id).eq("subject", info.subjects);
        return true;
    } else {
        return false;
    }
}

//Checks if the student has a record for the day.
export async function checkDate(info: Student) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("date").eq("student_id", info.student_id).eq("date", formatted).eq("subject", info.subjects).single();
    if(data === null) {
        return false;
    } else {
        return true;
    }
}

//Gets the subject ID that has input name value.
export async function getSubject(subject: string) {
    const { data } = await supabase.from("subject").select("id").eq("name", subject).single();
    return data || undefined;
}

//Adds the subject that the teacher/professor submits from addRemoveSubject page.
export async function addSubjects(id: string, subject: string) {
    console.log(id + " " + subject);
    if(await getSubject(subject) === undefined) {
        const { data } = await supabase.from("teacher").select("name").eq("id", id).single();
        await supabase.from("subject").insert({name: subject, teacher_id: id, teacher_name: data?.name});
        return true;
    }
    return false;
}

//Removes the subject that the user submitted.
export async function removeSubject(id: string, subjects: string) {
    if(await getSubject(subjects) !== undefined) {
        await supabase.from("subject").delete().eq("name", subjects).eq("teacher_id", id);
        return true;
    }
    return false;
}

//Gets all the subject for the user.
export async function getAllSubjects(id: string) {
    const { data } = await supabase.from("subject").select("id, name").eq("teacher_id", id);
    return data;
}

//Gets the ID of the user for verification.
export async function getEmail(info: Account) {
    const { data } = await supabase.from("account").select("id").eq("email", info.email).single();
    return data ? data.id : 0;
}

//Gets the ID of the user that has the submitted verification code.
export async function verifyCode(info: Account, code: string) {
    const { data } = await supabase.from("account").select("id").eq("verification", code).eq('email', info.email).single();
    return data ? data.id : 0;
}

//Updates password from forgot password.
export async function updatePassword(info: Account) {
    try{
        await supabase.from("account").update({password: info.password}).eq("email", info.email);
        return true;
    } catch(error) {
        return false;
    }
}

//Gets the data of the user for verification on log in.
export async function login(info: Account) {
    const { data, error } = await supabase.from("account").select("id, password").eq("email", info.email).eq("password", info.password).single();
    if(data) {
        return ({data: {id: data.id, password: data.password}});
    } else {
        return ({error: "Invlid credentials."});
    }
}

//Validate if the ID of the user exist.
export async function validateTeacher(info: Account) {
    const {data, error} = await supabase.from("account").select("id").eq("id", info.id).single();
    if(data) {
        return ({id: data.id});
    } else {
        return ({error: error});
    }
}

//Gets all the student records that the user wants. 
export async function getRecords(info: Student, date: string) {
    if(info.subjects === "") {
        return({error: "Enter a subject first"});
    }
    let query = supabase.from("attendance").select("*");
    if(info.name && info.subjects) {
        query = query.ilike("name", `%${info.name}%`).eq("subject", info.subjects);
    }
    if(info.subjects) {
        query = query.ilike("subject", `%${info.subjects}%`).eq("subject", info.subjects);
    } 
    if(info.student_id && info.subjects) {
        query = query.ilike("student_id", `%${info.student_id}%`).eq("subject", info.subjects);
    }
    if(date && info.subjects) {
        query = query.eq("date", `%${date}%`).eq("subject", info.subjects);
    }
    if(!(info.name || info.student_id || date || info.subjects)) {
        return({error: "No data"});
    }
    const {data, error} = await query;
    if(data) {
        return ({data: data});
    } return ({error: error});
}

//Verify if the student is existing
export async function verifyStudentData(info: Student) {
    const {data, error} = await supabase.from("students").select("student_id, name, subjects").eq("student_id", info.student_id).ilike("name", `%${info.name}%`).ilike("subjects", `%${info.subjects}%`).single();
    if(data) {
        return ({data: data});
    } return ({error: "Student doesn't exist"});
}
//Get all students.
export async function getAllStudent() {
    const { data, error } = await supabase.from("students").select("*");
    if(data) {
        return ({data});
    } else {
        return ({error});
    }
}
//Get selected students.
export async function getStudent(info: Student) {
    
    let query = supabase.from("students").select("*");
    if(info.student_id) {
        query = query.ilike("student_id", `%${info.student_id}%`);
    } 
    if(info.name) {
        query = query.ilike("name", `%${info.name}%`);
    }
    if(info.subjects) {
        query = query.ilike("subjects", `%${info.subjects}%`);
    }
    const {data} = await query;
    if(data) {
        return ({data});
    } else {
        return ({error: "Student doesn't exist"});
    }
}
//Add students to the database.
export async function addStudent(info: Student) {
    const { error } = await supabase.from("students").insert({student_id: info.student_id, name: info.name, subjects: info.subjects});
    if(!error) {
        return({success: `Student ${info.name} is added`});
    } else {
        return({error: "Failed to add student"});
    }
}
//Remove student from the table.
export async function removeStudent(info: Student) {
    const { error } = await supabase.from("students").delete().eq("student_id", info.student_id);
    if(!error) {
        return ({success: `Student ${info.name} was deleted`});
    } else {
        return ({error: "Failed to remove student"});
    }
}