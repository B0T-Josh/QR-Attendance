import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

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
        await supabase.from('teacher').insert([{id: id, name: info.name}]);
        const { data: prof, error: err } = await supabase.from('teacher').select('id, name').eq('id', id).single();
        if(err) {
            console.log(err);
            return false;
        }
        if(await addSubject(supabase, info, prof.name, prof.id)) {
            return true;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function addSubject(supabase: any, info: any, name: string, id: number) {
    try{
        let subjects = info.subjects.split(" ");
        for(const element of subjects) {
            const {error: err} = await supabase.from('subject').insert([{name: element, teacher_name: name, teacher_id: id}]);
            if(err) {
                console.log(err);
                return false;
            }
        }
    } catch(error) {
        console.log(error);
        return false;
    } 
    return true;
}

export async function getVerification(id: number) {
    try {
        const { data } = await supabase.from('teacher').select('verification').eq('id', id).single();
        return [data || { data: null }];
    } catch (error) {
        console.log(error);
        return [{ data: null }];
    }
}

export async function addRecord(info: any) {
    try {
        await supabase.from('attendance').insert({student_id: info.student_id, name: info.name, subject: info.subject});
        return true;
    } catch(error) {
        alert(error);
        return false;
    }
}

export async function scanned(info: any) {
    try {
        const res = await fetch("/api/addRecord", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(info)
        });
        if(!res.ok) {
            alert(`There is an error: ${JSON.stringify(res)}`);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        alert(error);
        return false;
    }
}