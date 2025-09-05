
export async function addUser(supabase, info) {
    try{
        const { data: account, error: accountErr } = await supabase.from('account').insert([{email: info.email, password: info.password}]).select().single();
        await addTeacher(supabase, info, account.id);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export async function addTeacher(supabase, info, id) {
    try {
        const { data: profile, error: profileErr } = await supabase.from('teacher').insert([{id: id, name: info.name}]).select().single();
        await addSubject(supabase, info, profile.name, profile.id);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export async function addSubject(supabase, info, name, id) {
    try{
        const { data, error } = await supabase.from('subject').insert([{name: info.subjects, teacher_name: name, teacher_id: id}]);
    } catch(error) {
        console.log(error);
        return false;
    } 
    return true;
}