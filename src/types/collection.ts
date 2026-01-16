import { Challenge, IOrganization } from ".";

// 榜题合集
export interface ICollection {
    id?: number;
    title?: string;
    description?: string;
    orgId?: number;
    cover?: string;
    raceProjectIds?: number[];
    tag?: string;
    createTime?: number;
    views?: number;
    code?: string;
    status?: number;
    type?: number;
    itemResList?: ICollectionProject[]
    raceOrganization?: IOrganization
}

export interface ICollectionProject {
    collectId?: number,
    createTime?: number,
    dataId?: number,
    id?: number,
    userId?: number,
    weight?: number
    data?: Challenge
}