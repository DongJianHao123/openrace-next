import { webRequest } from "@/services/request"
import { serverRequest } from "@/services/serverRequest"
import { OpenStatus, PageListParams } from "@/types"
import { ICollection } from "@/types/collection"

export const apiGetCollections = (params: ICollection & PageListParams) => {
    return webRequest.post<ICollection[]>('/raceCollection/getList', { ...params, status: OpenStatus.Open })
}

export const apiGetCollectionByCode = (organizationName: string, code: string) => {
    return webRequest.post<ICollection>('/raceCollection/getByOrgNameAndCode', { organizationName, code })
}

export const apiGetCollectionByOrgNameAndCode = (orgName: string, code: string) => {
    return webRequest.post<ICollection>('/raceCollection/getByOrgNameAndCode', { orgName, code })
}

export const apiGetServerCollectionByOrgNameAndCode = (orgName: string, code: string) => {
    return serverRequest.post<ICollection>('/raceCollection/getByOrgNameAndCode', { orgName, code })
}