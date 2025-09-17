import { getId } from "@/tools/getId";
import { useRouter } from 'next/navigation';

export function validateId() {
    const route = useRouter();
    if(parseInt(getId() || '0') <= 0) {
        route.push("/authPages/login");
    }
}