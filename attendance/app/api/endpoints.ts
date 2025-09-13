import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

function getTime() {
    const date = new Date();
    const time =
        String(date.getHours()).padStart(2, "0") + ":" +
        String(date.getMinutes()).padStart(2, "0") + ":" +
        String(date.getSeconds()).padStart(2, "0");
    return time; 
}

function getDate() {
    const date = new Date();
    const formatted = date.toISOString().split("T")[0];
    return formatted;
}

export async function addUser(info: any) {
    try{
        const { error } = await supabase.from('account').insert([{email: info.email, password: info.password}]);
        if(error) {
            console.log(error);
            return false;
        }
        const { data: prof, error: err } = await supabase.from('account').select('id').eq('email', info.email).single();
        if(err) {
            console.log(err);
            return false;
        }
        if(await addTeacher(supabase, info, prof.id)){
            return true;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

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

export async function getVerification(id: number) {
    try {
        const { data } = await supabase.from('account').select('verification').eq('id', id).single();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function addRecord(info: any) {
    try {
        await supabase.from('attendance').insert({student_id: info.student_id, name: info.name, subject: info.subject, time_in: getTime()});
        return true;
    } catch(error) {
        alert(error);
        return false;
    }
}

export async function addVerification(info: any) {
    try {
        await supabase.from('account').update({verification: info.verification}).eq('id', info.id);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

export async function verificationFromUser(info: any) {
    try {
        const data = await getVerification(info);
        return data;
    } catch(error) {
        console.log(error);
        return null;
    }
}

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

export async function checkDate(info: any) {
    const formatted = getDate();
    const { data } = await supabase.from('attendance').select("date").eq("student_id", info.student_id).eq("date", formatted).eq("subject", info.subject).single();
    if(data === null) {
        return false;
    } else {
        return true;
    }
}

export async function getSubject(subject: string) {
    const { data } = await supabase.from("subject").select("id").eq("name", subject).single();
    return data || undefined;
}

export async function addSubjects(info: any) {
    if(await getSubject(info.name) === undefined) {
        const { data } = await supabase.from("teacher").select("name").eq("id", info.id).single();
        await supabase.from("subject").insert({name: info.name, teacher_id: info.id, teacher_name: data?.name});
        return true;
    }
    console.log(`Add Subject error`);
    return false;
}

export async function removeSubject(info: any) {
    if(await getSubject(info.name) !== undefined) {
        await supabase.from("subject").delete().eq("name", info.name).eq("teacher_id", info.id);
        return true;
    }
    return false;
}

export async function getAllSubjects(info: any) {
    const { data } = await supabase.from("subject").select("id, name").eq("teacher_id", info.id);
    return data;
}

export async function getEmail(info: any) {
    const { data } = await supabase.from("account").select("id").eq("email", info.email).single();
    return data ? data.id : 0;
}

export async function verifyCode(info: any) {
    const { data } = await supabase.from("account").select("id").eq("verification", info.code);
    return data;
}

export async function updatePassword(info: any) {
    try{
        await supabase.from("account").update({password: info.password}).eq("email", info.email);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

export async function login(info: any) {
    const { data, error } = await supabase.from("account").select("id, password").eq("email", info.email).eq("password", info.password).single();
    if(data) {
        return ({data: {id: data.id, password: data.password}});
    } else {
        return ({error: error});
    }
}