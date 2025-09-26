
import { supabase } from "@/lib/supabase/supabaseClient";

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
    name: string | null;
    student_id: string | null;
    subjects: string[] | [];
}

type AccountProf = {
    email: string | null;
    password: string | null;
    name: string | null;
}

//Comes from the resgistration page. This adds the teacher's account to the database.
export async function addUser(info: AccountProf) {
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
    } else return ({error: "Profile already existed"});
}

//Adds the name of the teacher to the teacher table from the database.
export async function addTeacher(id: string | null, name: string | null) {
    const { error: err } = await supabase.from('teacher').insert([{id: id, name: name}]);
    if(err) {
        return false;
    }else return true;
}

//Checks if the verification code exist from account table.
export async function getVerification(id: string | null) {
        const { data } = await supabase.from('account').select('verification').eq('id', id).single();
        if(data) {
            return ({verification: data?.verification});
        } else {
            return({error: "Server error"});
        }
}

//Adds attendance record for students aftter scanning the QR.
export async function addRecord(student_id: string, subjects: string, name: string) {
    if(await validateSubject(subjects)) {
        const {error} = await supabase.from('attendance').insert({student_id: student_id, name: name, subject: [subjects], time_in: getTime()});
        if(!error) {
            return({success: `Attendance recorded for student ${name}`});
        } else {
            console.log(error);
            return({error: "Failed to record attendance. Student " + name});
        }
    } else {
        return({error: "Failed to record attendance. Student " + name});
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
    const {error} = await supabase.from('account').update({verification: verification}).eq('id', id);
    if(error) {
        return false;
    }
    return true;
}

//Adds time out to the student's record.
export async function timeOut(student_id: string, subjects: string) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("time_out").eq("date", formatted).eq("student_id", student_id).contains("subject", [subjects]).single();
    if(data?.time_out === null) {
        await supabase.from('attendance').update({time_out: getTime()}).eq("date", formatted).eq("student_id", student_id).contains("subject", [subjects]);
        return true;
    } else {
        return false;
    }
}

//Checks if the student has a record for the day.
export async function checkDate(student_id: string, subjects: string) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("date").eq("student_id", student_id).eq("date", formatted).contains("subject", [subjects]).single();
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
    if(await getSubject(subject) === undefined) {
        await supabase.from("subject").insert({name: subject, teacher_id: id});
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
export async function getEmail(email: string | null) {
    const { data } = await supabase.from("account").select("id").eq("email", email).single();
    return data ? data.id : 0;
}

//Gets the ID of the user that has the submitted verification code.
export async function verifyCode(code: string | null, email: string | null) {
    const { data } = await supabase.from("account").select("id").eq("verification", code).eq('email', email).single();
    return data ? data.id : 0;
}

//Updates password from forgot password.
export async function updatePassword(password: string | null, email: string | null) {
    const {error} = await supabase.from("account").update({password: password}).eq("email", email);
    if(error) {
        return false;
    }
    return true;
}

//Gets the data of the user for verification on log in.
export async function login(email: string, password: string) {
    const { data } = await supabase.from("account").select("id, password").eq("email", email).eq("password", password).single();
    if(data) {

        return ({data: {id: data.id, password: data.password}});
    } else {
        return ({error: "Invlid credentials."});
    }
}

//Validate if the ID of the user exist.
export async function validateTeacher(id: string) {
    const {data, error} = await supabase.from("account").select("id").eq("id", id).single();
    if(data) {
        return ({exist: "User exist"});
    } else {
        return ({error: error});
    }
}

//Gets all the student records that the user wants. 
export async function getRecords(subject: string) {
    if(subject === "") {
        return({error: "Enter a subject first"});
    }
    let query = supabase.from("attendance").select("*");
    query = query.ilike("subject", `${subject}`);
    const {data, error} = await query;
    if(data) {
        return ({data: data});
    } return ({error: error});
}


export async function getAllRecords(subjects: string[]) {
    const {data, error} = await supabase.from("attendance").select("*").overlaps("subject", subjects);
    if(data) {
        return ({data: data});
    } return ({error: error});
}

//Verify if the student is existing
export async function verifyStudent(student_id: string) {
    const {data} = await supabase.from("students").select("id").eq("student_id", student_id.trim()).maybeSingle();
    if(data) {
        return ({exist: "Student exist"});
    } return ({empty: "Student doesn't exist"});
}

//Get selected students.
export async function getStudent(subject: string) {
    const {data} = await supabase.from("students").select("id, student_id, name, subjects").ilike("subjects", `%${subject}%`);
    if(data) {
        return ({data});
    } else {
        return ({error: "Student doesn't exist"});
    }
}

//Get selected students.
export async function getStudentByTeacherSubject(subjects: string[]) {
    const {data} = await supabase.from("students").select("id, student_id, name, subjects").overlaps("subjects", subjects);
    if(data) {
        return ({data});
    } else {
        return ({error: "No data found"});
    }
}

//Fetches all student.
export async function getAllStudent() {
    const {data} = await supabase.from("students").select("*");
    if(data) {
        return ({data});
    } else {
        return ({error: "Student doesn't exist"});
    }
}

//Add students to the database.
export async function addStudent(info: Student[]) {
    const payload = info.map((stud) => ({
        student_id: stud.student_id,
        name: stud.name,
        subjects: stud.subjects
    }));

    const {error} = await supabase.from("students").insert(payload);

    if(!error) {
        return({success: `Student is added`});
    } else {
        return({error: "Failed to add student"});
    }
}

//Remove student from the table.
export async function removeStudent(student_id: string, teacher_id: string) {
    const { error } = await supabase.from("students").delete().eq("student_id", student_id).eq("teacher_id", teacher_id);
    if(!error) {
        return ({success: `Student ${student_id} was deleted`});
    } else {
        return ({error: "Failed to remove student"});
    }
}

//Updates the subject for a student in the DB.
export async function updateSubjectForStudent(student_id: string, teacher_id: string, subjects: string) {
    const {error} = await supabase.from("students").select("id").eq("student_id", student_id).eq("teacher_id", teacher_id);
    if(!error) {
        await supabase.from("students").update({subjects: subjects}).eq("student_id", student_id);
        return ({success: "Subject successfully updated"});
    } else {
        return({error: "Student doesn't exist"});
    }
}