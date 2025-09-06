import { createClient } from "@supabase/supabase-js";

export function encryptPassword(password: string) {
  let asciiArray = password.split("").map((char: string) => char.charCodeAt(0));
  let hashedPass = asciiArray.join("");
  return hashedPass;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function addUser(info: any) {
    try{
        const { data: account, error: accountErr } = await supabase.from('account').insert([{email: info.email, password: info.password}]);
        const { data: prof, error: err} = await supabase.from('account').select('id').eq('email', info.email).single();
        if(prof === null) throw new Error("No profile found");
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
        const { data: profile, error: profileErr } = await supabase.from('teacher').insert([{id: id, name: info.name}]);
        const { data: prof, error: err} = await supabase.from('teacher').select('id, name').eq('id', id).single();
        if(prof === null) throw new Error("No profile found");
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
        const { data, error } = await supabase.from('subject').insert([{name: info.subjects, teacher_name: name, teacher_id: id}]);
    } catch(error) {
        console.log(error);
        return false;
    } 
    return true;
}

export async function logIn(supabase: any, info: any) {
    try {
        const { data, error } = await supabase.from('account').select('id').eq('email', info.email).eq('password', info.password).single();
        return data.id;
    } catch (error) {
        console.log(error);
        return 0;
    }
}