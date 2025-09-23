type Student = {
    name: string | null;
    student_id: string | null;
    subjects: string | null;
    teacher_id: string | null;
}

//Request to add student record.
export async function scanned(info: Student) {
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
    } catch(error) {
        return {err: error};
    }
}

//Request to add subject.
export async function handleAddSubject(info: {id: string | null, subjects: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/subject", {
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
export async function handleRemoveSubject(info: {id: string | null, subjects: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/subject", {
        method: "DELETE",
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
export async function getSubjects(info: {id: string | null}) {
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

//Request to validate user email if it is existing.
export async function validateEmail(info: {email: string | null}) {
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
export async function validateCode(info: {code: string | null, email: string | null}) {
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
export async function updatePassword(info:{password: string | null, email: string | null}) {
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
export async function logIn(info: {email: string | null, password: string | null}) {
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
export async function register(info: {email: string | null, password: string | null, name: string | null}) {
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
export async function getValidation(info: {id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getVerification", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {message, error} = await res.json();
    if(res.ok) {
        return ({message: message})
    }
    return ({error: error});
}

//Get the teacher ID and if ID is verified, the teacher or user is verified.
export async function validateTeacher(info: {uid: string | null}) {
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

//Request to add student.
export async function handleAddStudent(info: {student_id: string | null, name: string | null, subjects: string | null, teacher_id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/addStudent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    }
    return ({error: error});
}

//Request to add student.
export async function verifyStudent(info: {student_id: string | null, teacher_id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/verifyStudent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {exist, empty} = await res.json();
    if(res.ok) {
        if(exist) {
            return ({exist: exist});
        } else {
            return ({empty: empty});
        }
    }
    return ({error: "Server error"});
}



//Request to delete a student from the table.
export async function handleRemoveStudent(info: {student_id: string | null, teacher_id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/addStudent", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    }
    return ({error: error});
}

//Get all student from the database.
export async function getStudents() {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/addStudent", {
        method: "GET"
    });
    //Processes response from URL.
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    }
    return ({error: error});
}

//Get selected student from the database.
export async function getStudentByTeacherID(info: {teacher_id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getStudents", {
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

//Get all student record base on the subject.
export async function getRecords(info: {subject: string}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getRecords", {
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

//Get all student record.
export async function getAllRecords(info: {teacher_id: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/getAllRecords", {
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

export async function updateSubject(info: {teacher_id: string | null, student_id: string | null, subjects: string | null}) {
    //Pass the submitted data to the URL.
    const res = await fetch("/api/updateSubject", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    //Processes response from URL.
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    } 
    return ({error: error});
}

