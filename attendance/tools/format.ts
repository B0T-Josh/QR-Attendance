    export default function format(name: string) {
        try {
            if(name) {
                var temp = name.trim().split(", ");
                var temp_name = temp[1].replace(".", "").split(" "); 
                var last_name = temp[0].toUpperCase(); 
                var first_name = ""; 
                for(let i = 0; i < temp_name.length; i++) {
                    first_name += temp_name[i].length > 2 ? " " + temp_name[i].charAt(0).toUpperCase() + temp_name[i].substring(1).toLowerCase() : "";
                }
                var middle_ini = first_name.split(" ").find(item => item.toLowerCase() === temp_name[temp_name.length-1].toLowerCase()) ? "" : temp_name[temp_name.length-1].toUpperCase();
                var formatted: string | "" = last_name + "," + first_name + (middle_ini === "" ? "" : " " + middle_ini.charAt(0) + ".");

                return ({formatted: formatted.trim()});
            }
        } catch(error) {
            return ({error: "Follow this format. SURNAME, Firstname M.I."});
        }
    }