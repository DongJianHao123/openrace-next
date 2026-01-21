import { apiGetChallenges } from "@/api/webApi/task";
import ChallengeCenter from "@/views/ChallengeCenter";

export const metadata = {
    title: "任务中心 - openrace",
    description: "查看 openrace 任务中心",
}

const getData = async () => {
    const { data } = await apiGetChallenges();
    return data?.list || [];
}

const Page = async () => {
    const data = await getData();
    return <ChallengeCenter data={data} />;
}

export default Page;