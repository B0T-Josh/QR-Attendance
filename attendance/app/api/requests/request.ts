//Request to add student record.
export async function scanned(info: any) {
    try {
        //Pass the submitted data to the URL.
        const res = await fetch("/api/addRecord", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(info)
        });
        //Processes response from URL.
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
//Request to add subject.
export async function handleAddSubject(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/addSubject", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}
//Request to remove subject.
export async function handleRemoveSubject(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/removeSubject", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}
//Request to get all subjects.
export async function getSubjects(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getSubjects", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return (data);
    }
    return ({error: data.error});
}
//Request to validate user email if it is eisting.
export async function validateEmail(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getEmail", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
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
//Request to verify if the code for the user exist.
export async function validateCode(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getCode", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({success: data.success});
    }
    return ({error: data.error});
}
//Request to update the password of the user.
export async function updatePassword(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/updatePassword", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({success: data.success});
    }
    return ({error: data.error});
}
//Request to login.
export async function logIn(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {  'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({id: data.id});
    } else {
        return ({error: data.error});
    }
}
//Request to add user.
export async function register(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
    });
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    } else {
        return ({error: error});
    }
}
//Request to remove subject.
export async function getValidation(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getVerification", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {verification, error} = await res.json();
    if(res.ok) {
        return ({verification: verification})
    }
    return ({error: error});
}

export async function validateTeacher(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/verifyUser", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {id, error} = await res.json();
    if(id) {
        return ({success: "User exist"});
    } else {
        return ({error: error});
    }
}

export async function handleAddStudent(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/students", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}

export async function handleRemoveStudent(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getStudents", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}

export async function getStudent(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getStudents", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const data = await res.json();
    if(res.ok) {
        return (data);
    }
    return ({error: data.error});
}

export async function getRecords(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getRecords", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {data} = await res.json();
    if(res.ok) {
        return ({data: data});
    } 
    return ({error: data});
}

export async function verifyStudentData(info: any) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/verifyStudentData", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    } 
    return ({error: error});
}