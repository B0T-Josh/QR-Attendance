    export default function format(name: string) {
        try {
            if(name) {
                var temp = name.trim().split(", "); //Infante, Gene Paul DC. -> ["Infante", " Gene Paul DC."]
                var temp_name = temp[1].replace(".", "").split(" "); //["Infante", "Gene Paul DC."] -> ["Gene", "Paul", "DC"]
                var last_name = temp[0].toUpperCase(); //"INFANTE"
                var first_name = ""; 
                for(let i = 0; i < temp_name.length; i++) {
                    first_name += temp_name[i].length > 2 ? " " + temp_name[i].charAt(0).toUpperCase() + temp_name[i].substring(1).toLowerCase() : ""; //Concatenates and checks if the index is Middle initial.
                }
                var middle_ini = first_name.toLowerCase().includes(temp_name[temp_name.length-1].toLowerCase()) ? "." : " " + temp_name[temp_name.length-1].toUpperCase() + "."; //Checks if last index is equal to first name or middle initial
                var formatted: string | "" = last_name + "," + first_name + middle_ini; //Merges Surname, Firstname, and Middle initial to form formatted name.
                
                return ({formatted: formatted});
        }
        } catch(error) {
            return ({error: "Invalid format"});
        }
    }