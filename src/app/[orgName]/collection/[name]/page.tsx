import { apiGetCollectionByOrgNameAndCode } from "@/api/webApi/collection";
import CollectionDetail from "@/views/CollectionDetail";
import { ResolvingMetadata } from "next";

// 接收路由参数 params 和父级元数据 parentMetadata
export async function generateMetadata(
  { params, searchParams }: { params: { orgName: string, name: string }, searchParams: { tab: string } }
) {
    const { orgName, name } = await params;
    const data = await getData(orgName, name);
    return {
        title: `${data?.title || name} - 技术合集 - openrace - ${orgName}`,
        description: data?.description || "",
    }
}

const getData = async (orgName: string, name: string) => {
    const res = await apiGetCollectionByOrgNameAndCode(orgName, name);
    return res.data || {};
}

 const Page=async ({ params }: { params: { orgName: string, name: string } }) => {
    const { orgName, name } = await params;
    const data = await getData(orgName, name);
    return <CollectionDetail collection={data || {}} />
}

export default Page;