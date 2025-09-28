type Student = {
    name: string | null;
    student_id: string | null;
    subjects: string | null;
}

type Profile = {
  student_id: string | null;
  name: string | null;
  subjects: string[]; 
};

//Request to add student record.
export async function scanned(info: Student) {
    const res = await fetch("/api/addRecord", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(info)
    });

    const data = await res.json();
    if(res.ok) {
        if(data.success) {
            return ({message: data.success});
        } else {
            return ({error: data.error});
        }
    } else {
        return {err: data.error};
    }
}

//Request to add subject.
export async function handleAddSubject(info: {id: string | null, subjects: string | null}) {
    const res = await fetch("/api/subject", {
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

//Request to remove subject.
export async function handleRemoveSubject(info: {id: string | null, subjects: string | null}) {
    const res = await fetch("/api/subject", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const data = await res.json();
    if(res.ok) {
        return ({message: data.message});
    }
    return ({error: data.error});
}

//Request to get all subjects.
export async function getSubjects(info: {id: string | null}) {
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

//Request to validate user email if it is existing.
export async function validateEmail(info: {email: string | null}) {
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

//Request to verify if the code for the user exist.
export async function validateCode(info: {code: string | null, email: string | null}) {
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

//Request to update the password of the user.
export async function updatePassword(info:{password: string | null, email: string | null}) {
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

//Request to login.
export async function logIn(info: {email: string | null, password: string | null}) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {  'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    } else {
        return ({error: error});
    }
}

//Request to login.
export async function logOut() {
    const res = await fetch('/api/logout', {
      method: 'POST'
    });
    const {success} = await res.json();
    if(res.ok) {
        return ({success: success});
    } else {
        return ({error: "Server error"});
    }
}

//Request to add user.
export async function register(info: {email: string | null, password: string | null, name: string | null}) {
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
    const res = await fetch("/api/getVerification", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    const {message, error} = await res.json();
    if(res.ok) {
        return ({message: message})
    }
    return ({error: error});
}

//Request to add student.
export async function handleAddStudent(info: Profile[]) {
    const res = await fetch("/api/addStudent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    }
    return ({error: error});
}

//Request to add student.
export async function verifyStudent(info: {student_id: string | null}) {
    const res = await fetch("/api/verifyStudent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
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
export async function handleRemoveStudent(info: {student_id: string | null}) {
    const res = await fetch("/api/addStudent", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    }
    return ({error: error});
}

//Get all student from the database.
export async function getStudents() {
    const res = await fetch("/api/addStudent", {
        method: "GET"
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    }
    return ({error: error});
}

//Get selected student from the database.
export async function getStudentByTeacherSubject(info: {subjects: string[] | []}) {
    const res = await fetch("/api/getStudents", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    }
    return ({error: error});
}

//Get all student record base on the subject.
export async function getRecords(info: {subject: string}) {
    const res = await fetch("/api/getRecords", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    } 
    return ({error: error});
}

//Get all student record.
export async function getAllRecords(info: {subjects: string[] | []}) {
    const res = await fetch("/api/getAllRecords", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    } 
    return ({error: error});
}

//Update the subjects of the student
export async function updateSubject(info: { student_id: string | null, subjects: string[] | null}) {
    const res = await fetch("/api/updateSubject", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(info)
    });
    const {success, error} = await res.json();
    if(res.ok) {
        return ({success: success});
    } 
    return ({error: error});
}

export async function verifyUser() {
    const res = await fetch("/api/verifyUser", {
        method: "GET"
    });
    const {data, error} = await res.json();
    if(res.ok) {
        return ({data: data});
    } 
    return ({error: error});
}

