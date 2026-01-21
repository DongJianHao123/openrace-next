import { apiGetCollections } from "@/api/webApi/collection";
import { apiGetOrgByLoginName } from "@/api/webApi/organization";
import { apiGetChallenges } from "@/api/webApi/task";
import OrganizationDetail from "@/views/OrganizationDetail";
import { Empty } from "antd";

const getData = async (orgName: string) => {
    const res = await apiGetOrgByLoginName(orgName);
    if (!res.data) {
        return {};
    }
    const challengesRes = await apiGetChallenges({ orgId: res.data.orgId });
    const collectionsRes = await apiGetCollections({ orgId: res.data.orgId });
    return {
        org:res.data,
        challenges:challengesRes.data?.list || [],
        collections:collectionsRes.data || [],
    };
}
const Page = async ({ params }: { params: { orgName: string } }) => {
    const { orgName } = await params;
    const {org,challenges,collections} = await getData(orgName);
    if (!org) {
        return <Empty description="暂无数据" className="mt-12" />;
    }
    return <OrganizationDetail organization={org!} challenges={challenges!} collections={collections!} />
}

export default Page;