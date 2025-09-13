export async function scanned(info: any) {
    try {
        const res = await fetch("/api/addRecord", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(info)
        });
        const data = await res.json();
        if(!res.ok) {
            return {error: data.error};
        } else {
            return {message: data.success};
        }
    } catch(error: any) {
        return {err: error};
    }
}

export async function handleAddSubject(info: any) {
    const res = await fetch("/api/addSubject", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}

export async function handleRemoveSubject(info: any) {
    const res = await fetch("/api/removeSubject", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}

export async function getSubjects(info: any) {
    const res = await fetch("/api/getSubjects", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return (data);
    }
    return ({error: data.error});
}

export async function validateEmail(info: any) {
    const res = await fetch("/api/getEmail", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const {success, error} = await res.json();
    if(res.ok) {
        if(success) {
            return ({success: success});
        } else {
            return ({error: error});
        }
    }
    return ({error: error});
}

export async function validateCode(info: any) {
    const res = await fetch("/api/getCode", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({success: data.success});
    }
    return ({error: data.error});
}

export async function updatePassword(info: any) {
    const res = await fetch("/api/updatePassword", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({success: data.success});
    }
    return ({error: data.error});
}

export async function logIn(info: any) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {  'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({id: data.id});
    } else {
        return ({error: data.error});
    }
}

export async function register(info: any) {
    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
    });
    const { success, error } = await res.json();
    if(res.ok) {
        return ({success: success});
    } else {
        return ({error: error});
    }
}