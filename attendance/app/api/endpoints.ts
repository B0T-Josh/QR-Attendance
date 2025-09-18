
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

//Comes from the resgistration page. This adds the teacher's account to the database.
export async function addUser(info: any) {
    try{
        const { error } = await supabase.from('account').insert([{email: info.email, password: info.password}]);
        if(error) {
            return ({error: "Email address already exist"});
        }
        const { data: prof, error: err } = await supabase.from('account').select('id').eq('email', info.email).single();
        if(err) {
            return({error: "There is an error fetching id"});
        }
        if(await addTeacher(supabase, info, prof.id)){
            return ({success: "Profile was successfully created"});
        } else return ({error: "Creating profile failed"});
    } catch (error) {
        return ({error: "Server error"});
    }
}

//Adds the name of the teacher to the teacher table from the database.
export async function addTeacher(supabase: any, info: any, id: number) {
    try {
        const { error: err } = await supabase.from('teacher').insert([{id: id, name: info.name}]);
        if(err) {
            console.log(err);
            return false;
        }else return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Checks if the verification code exist from account table.
export async function getVerification(id: any) {
    try {
        const { data } = await supabase.from('account').select('verification').eq('id', id).single();
        return ({verification: data?.verification});
    } catch (error) {
        return ({error: "There is no verification code"});
    }
}

//Adds attendance record for students aftter scanning the QR.
export async function addRecord(info: any) {
    try {
       if(await validateSubject(info.subject)) {
        await supabase.from('attendance').insert({student_id: info.student_id, name: info.name, subject: info.subject, time_in: getTime()});
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
export async function addVerification(info: any) {
    try {
        await supabase.from('account').update({verification: info.verification}).eq('id', info.id);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

//Adds time out to the student's record.
export async function timeOut(info: any) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("time_out").eq("date", formatted).eq("student_id", info.student_id).eq("subject", info.subject).single();
    if(data?.time_out === null) {
        await supabase.from('attendance').update({time_out: getTime()}).eq("date", formatted).eq("student_id", info.student_id).eq("subject", info.subject);
        return true;
    } else {
        return false;
    }
}

//Checks if the student has a record for the day.
export async function checkDate(info: any) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("date").eq("student_id", info.student_id).eq("date", formatted).eq("subject", info.subject).single();
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
export async function addSubjects(info: any) {
    if(await getSubject(info.name) === undefined) {
        const { data } = await supabase.from("teacher").select("name").eq("id", info.id).single();
        await supabase.from("subject").insert({name: info.name, teacher_id: info.id, teacher_name: data?.name});
        return true;
    }
    console.log(`Add Subject error`);
    return false;
}

//Removes the subject that the user submitted.
export async function removeSubject(info: any) {
    if(await getSubject(info.name) !== undefined) {
        await supabase.from("subject").delete().eq("name", info.name).eq("teacher_id", info.id);
        return true;
    }
    return false;
}

//Gets all the subject for the user.
export async function getAllSubjects(info: any) {
    const { data } = await supabase.from("subject").select("id, name").eq("teacher_id", info.id);
    return data;
}

//Gets the ID of the user for verification.
export async function getEmail(info: any) {
    const { data } = await supabase.from("account").select("id").eq("email", info.email).single();
    return data ? data.id : 0;
}

//Gets the ID of the user that has the submitted verification code.
export async function verifyCode(info: any) {
    const { data } = await supabase.from("account").select("id").eq("verification", info.code).eq('email', info.email).single();
    return data ? data.id : 0;
}

//Updates password from forgot password.
export async function updatePassword(info: any) {
    try{
        await supabase.from("account").update({password: info.password}).eq("email", info.email);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

//Gets the data of the user for verification on log in.
export async function login(info: any) {
    const { data, error } = await supabase.from("account").select("id, password").eq("email", info.email).eq("password", info.password).single();
    if(data) {
        return ({data: {id: data.id, password: data.password}});
    } else {
        return ({error: "Invlid credentials."});
    }
}

//Validate if the ID of the user exist.
export async function validateTeacher(info: any) {
    const {data, error} = await supabase.from("account").select("id").eq("id", info.id).single();
    if(data) {
        return ({id: data.id});
    } else {
        return ({error: error});
    }
}

//Gets all the student records that the user wants. 
export async function getRecords(info: any) {
    let query = supabase.from("attendance").select("*");
    if(info.data.name) {
        query = query.eq("name", info.data.name);
    }
    if(info.data.subject) {
        query = query.eq("subject", info.data.subject);
    } 
    if(info.data.id) {
        query = query.eq("student_id", info.data.id);
    }
    if(info.data.date) {
        query = query.eq("date", info.data.date);
    }
    if(!(info.data.name || info.data.id || info.data.date || info.data.subject)) {
        return({data: "No data"});
    }
    const {data, error} = await query;
    if(data) {
        return ({data: data});
    } return ({error: error});
}

//Verify if the student is existing
export async function verifyStudentData(info: any) {
    const {data, error} = await supabase.from("students").select("*").eq("student_id", info.id).eq("name", info.name).single();
    if(data) {
        return ({data: data});
    } return ({error: "Student doesn't exist"});
}