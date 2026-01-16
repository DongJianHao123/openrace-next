// app/page.tsx
import { apiGetCollections } from "@/api/webApi/collection";
import { apiGetOrganizations } from "@/api/webApi/organization";
import { apiGetChallenges } from "@/api/webApi/task";
import { CHALLENGES_WHITELIST, COLLECTIONS_WHITELIST, ORGANIZATIONS_WHITELIST } from "@/config/dataWhitelist";
import { pickWhitelistFields } from "@/utils/dataOptimize";
import HomePage from "@/views/HomePage";

const getData = async () => {
  const [challenges, collections, organizations] = await Promise.all([
    apiGetChallenges(),
    apiGetCollections({ page: 1, pageSize: 3 }),
    apiGetOrganizations({}),
  ]);
  return JSON.parse(JSON.stringify( {
    challenges: pickWhitelistFields(challenges.data?.list || [], CHALLENGES_WHITELIST) || [],
    collections: pickWhitelistFields(collections.data || [], COLLECTIONS_WHITELIST) || [],
    organizations: pickWhitelistFields(organizations.data?.list || [], ORGANIZATIONS_WHITELIST) || [],
  }));

}

export default async function Home() {
  // 调用处理函数获取压缩数据
  const data = await getData();
  // 强制深拷贝，确保没有任何隐藏引用
  
  return <HomePage {...data} />;
}