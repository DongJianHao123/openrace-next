import { webRequest } from "@/services/request";
import { IOrganization, PageListParams, ResponseListType } from "@/types";

export const apiGetOrgByLoginName = (loginName: string) => {
    return webRequest.post<IOrganization>(`/raceOrganization/getOrganizationByLoginName`, { loginName });
}

export const apiGetOrganizations = (params: IOrganization & PageListParams) => {
    return webRequest.post<ResponseListType<IOrganization>>('/raceOrganization/getListPager', params);
}