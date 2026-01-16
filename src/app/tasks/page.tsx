import { apiGetChallenges } from "@/api/webApi/task";
import ChallengeCenter from "@/views/ChallengeCenter";

const getData = async () => {
    const { data } = await apiGetChallenges();
    return data?.list || [];
}

const Page = async () => {
    const data = await getData();
    return <ChallengeCenter data={data} />;
}

export default Page;