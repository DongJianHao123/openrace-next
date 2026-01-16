import UserProfile from "@/views/UserProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    if (!(await cookies()).get('web-token')) {
        redirect('/login?from=/profile');
    }
    return <UserProfile />;
}
