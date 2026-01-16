import { Challenge } from ".";
import { IUser } from "./user";

export interface IProjectTeam {
    announcementTime?: number;
    description?: string;
    id?: number;
    orgId?: number;
    plan?: string;
    projectId?: number;
    status?: number;
    teamName?: string;
    updateTime?: number;
    userId?: number;
    workFinishTime?: number;
    workPassTime?: number;
    workStartTime?: number;
    count?: number; // 成员数量
    userJoin?: boolean; // 当前用户是否已加入该队伍
    userJoinStatus?: number; // 当前用户加入状态 (1-已加入, 2-待审核)
    userName?: string; // 队长名称

    avatar?: string;
    contactWay?: string;
    members?: string;
    progress?: number;
    specialty?: string;
    role?: string;
    lastUpdate?: string;
    statusText?: string;

    userList?: ITeamUser[];
    raceProject?: Challenge;
    raceProjectTeamRecords?: IProjectTeamRecord[];
    teamUsers?: ITeamUser[];
}

export interface ITeamUser {
    applyContent?: string;
    applyTime?: number;
    passTime?: number;
    projectId?: number;
    role?: string;
    status?: number;
    teamId?: number;
    teamUserId?: number;
    user?: IUser;
    userId?: number;
    userName?: string;
    avatar?: string;
    team?: IProjectTeam;
}

export interface IProjectTeamRecord {
    content?: string;
    createTime?: number;
    file?: string;
    id?: number;
    progress?: number;
    projectId?: number;
    teamId?: number;
    userId?: number;
    userName?: string;
}