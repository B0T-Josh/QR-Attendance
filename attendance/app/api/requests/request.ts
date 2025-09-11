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