import { apiGetCollectionByOrgNameAndCode } from "@/api/webApi/collection";
import CollectionDetail from "@/views/CollectionDetail";


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