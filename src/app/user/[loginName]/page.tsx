import { apiGetUserTeamsByUserId } from "@/api/webApi/projectTeam";
import { apiGetUserInfoByLogin } from "@/api/webApi/user";
import UserPage from "@/views/UserPage";

const getData = async (loginName: string) => {
    const res = await apiGetUserInfoByLogin({ login: loginName, userConfigField: 'school,major,city,githubName,goodAt,learningStatus,workingStatus' });
    const userTeams = await apiGetUserTeamsByUserId(res.data?.userInfo?.userId || 0);
    return {
        userInfo: res.data?.userInfo || {},
        userTeams: userTeams || [],
    };
}


export default async function Page({ params }: { params: { loginName: string } }) {
    const { loginName } = await params;
    const data = await getData(loginName);
    return <UserPage user={data.userInfo || {}} userTeams={data.userTeams || []} />
}