    export default function format(name: string) {
        try {
            if(name) {
                var temp = name.split(", ");
                var temp_name = temp[1].replace(".", "").split(" ");
                var last_name = temp[0].toUpperCase();
                var first_name = temp_name[0].charAt(0).toUpperCase() + temp_name[0].substring(1).toLowerCase() + " ";
                if(temp_name.length > 2) {
                    for(let i = 1; i < temp.length; i++) {
                        first_name += temp_name[i].charAt(0).toUpperCase() + temp_name[i].substring(1).toLowerCase() + " ";
                    }
                } 
                var middle_ini = temp_name[temp_name.length-1].toUpperCase() + '.';
                var formatted: string = last_name + ", " + first_name + middle_ini;
                return ({formatted: formatted});
            }
        } catch(error) {
            return ({error: "Enter the right name format\nSURNAME, Firstname M.I."});
        }
    }