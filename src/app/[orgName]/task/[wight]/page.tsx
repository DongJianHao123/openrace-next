import { apiGetServerChallengeByOrgLoginName } from "@/api/serverApi/task";
import { apiGetProjectTeams } from "@/api/webApi/projectTeam";
import ChallengeDetail from "@/views/ChallengeDetail";

const getData = async (orgName: string, wight: string) => {
    const { data } = await apiGetServerChallengeByOrgLoginName(orgName, Number(wight));
    const teams = await apiGetProjectTeams({ projectId: data?.id });
    if (!data) {
        return {};
    }
    data.joinTeams = data.joinTeams?.map(joinTeam => ({
        ...joinTeam,
        teamUsers: teams.data?.list?.find(team => team.id === joinTeam.id)?.teamUsers || []
    })) || []
    return {
        ...data,
    };
}

const Page = async ({ params }: { params: { orgName: string, wight: string } }) => {
    const { orgName, wight } = await params;
    const data = await getData(orgName, wight);
    return <ChallengeDetail challenge={data || {}} />
}

export default Page;