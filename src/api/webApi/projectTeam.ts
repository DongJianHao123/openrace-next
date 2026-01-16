import { webRequest } from "@/services/request"
import { PageListParams, ResponseListType } from "@/types"
import { IProjectTeam, IProjectTeamRecord, ITeamUser } from "@/types/projectTeam"

export const apiJoinRaceProject = (params: IProjectTeam) => {
    return webRequest.post<IProjectTeam>('/raceProjectTeam/create', params)
}

export const apiGetProjectTeamDetails = (teamId: number) => {
    return webRequest.post<IProjectTeam>('/raceProjectTeam/get', { id: teamId })
}

export const apiUpdateProjectTeam = (params: IProjectTeam) => {
    return webRequest.post<IProjectTeam>('/raceProjectTeam/update', params)
}

export const apiDeleteProjectTeam = (teamId: string) => {
    return webRequest.post<void>('/raceProjectTeam/delete', { teamId })
}

export const apiListProjectTeams = (projectId: number) => {
    return webRequest.post<IProjectTeam[]>('/raceProjectTeam/getList', { projectId })
}

export const apiGetProjectTeams = (params: IProjectTeam & PageListParams) => {
    return webRequest.post<ResponseListType<IProjectTeam>>('/raceProjectTeam/getListPager', params)
}

export const apiApplyToJoinTeam = ({ teamId, applyContent }: { teamId: number, applyContent: string }) => {
    return webRequest.post<void>('/raceProjectTeamUser/create', { teamId, applyContent })
}

export const apiSubmitProjectRecord = (params: {
    teamId: number,
    content: string,
    file: string
    progress?: number
}) => {
    return webRequest.post<void>('/raceProjectTeamRecord/create', params)
}

export const apiGetProjectRecords = (teamId: number) => {
    return webRequest.post<IProjectTeamRecord[]>('/raceProjectTeamRecord/getList', { teamId })
}


export const apiGetUserCreatedTeams = () => {
    return webRequest.post<IProjectTeam[]>('/raceProjectTeam/getUserCreateTeam')
}


export const apiGetUserJoinTeams = () => {
    return webRequest.post<IProjectTeam[]>('/raceProjectTeam/getUserJoinTeam')
}

export const apiGetTeamUsers = (userId: number) => {
    return webRequest.post<ITeamUser[]>('/raceProjectTeamUser/getList', { userId })
}


export const apiGetUserTeamsByUserId = async (userId: number) => {
    const teamUserListRes = await apiGetTeamUsers(userId);
    const teamIds = teamUserListRes.data?.map(item => item.teamId) || [];
    const teamsRes = await Promise.all(teamIds.map(teamId => teamId ? apiGetProjectTeamDetails(teamId) : Promise.resolve({ data: {} as IProjectTeam })));
    const teams = teamsRes.map(item => item.data) || [];
    const res = teamUserListRes.data?.map(item => {
        item.team = teams.find(team => team?.id === item.teamId)        
        return item
    })
    return res;
}