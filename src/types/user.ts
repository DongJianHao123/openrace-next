export interface IUserProfile {
  advice?: string;
  channel?: string;
  city?: string;
  currentState?: string;
  desire?: string;
  githubName?: string;
  giteeName?: string;
  CNBName?: string;
  cnbName?: string;
  goodAt?: string;
  identityStatus?: string;
  workingStatus?: string; //目前学习/工作状态
  learningStatus?: string;
  major?: string; //专业
  wechat?: string;
  school?: string;
  resume?: IResume;
  idCard?: string;

  age?: number;
  company?: string; //公司
  grade?: string; //具体年级/工作几年
  workPost?: string; //工作岗位 ,前端，后端，运维。。。
  address?: string; //具体地址，类似于收货地址
  province?: string;
  region?: string;
  interestRegion?: string;
  tag?: string[];
  wxId?: string;
  rank?: 7; //社区影响力
}

interface IUserPerformance {
  courseCount?: number;
  joinCampCount?: number;
  joinTeamCount?: number;
  lastLogin?: number;
  myTeamCount?: number;
  totalInvitationCount?: number;
  totalVideoCount?: number;
  totalVideoTime?: number;
}

export interface IUser {
  address?: IAddress;
  avatar?: string;
  userId?: number;
  name?: string;
  createAt?: number;
  updateAt?: number;
  gender?: number;
  phone?: string;
  status?: number;
  token?: string;
  login?: string;
  wx?: string;
  email?: string;
  userConfigList?: IUserConfig[];
  profile?: IUserProfile;
  userConfig?: IUserProfile;
  invitorId?: string; //邀请人Id或者邀请码
  performance?: IUserPerformance;
}

export type IUserQuryParams = {
  config?: {
    name: string;
    useLike: boolean;
    value: string;
  }[];
  needConfig?: boolean;
  needPerformance?: boolean;
};

export interface ICampUser {
  campUserId?: number;
  campId?: number;
  userId?: number;
  user?: IUser;
  invitationCode?: string;
  invitationFrom?: string;
  addressList?: IAddress[];
  type?: string;
  config?: string;
  desire?: string;
  invitationFromName?: string;
  needInvitationFrom?: boolean;
  needPhone?: boolean;
  needAddress?: boolean;
  phone?: string;
  startNum?: 0;
  userName?: string;
  time?: number;
  createTime?: number;

  createTimeFilter?: {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
  };
}

export interface IAddress {
  addressId?: number;
  userId?: number;
  name?: string;
  phone?: string;
  province?: string;
  city?: string;
  county?: string;
  address?: string;
  config?: IAddressConfig | string;

  createAt?: number;
  remark?: string;
  status?: number;
  updateAt?: number;
}

export interface IAddressConfig {
  photo?: string;
}

export interface IUserConfig {
  configId: number;
  content: string;
  createAt: number;
  name: string;
  type: number;
  updateAt: number;
  userId: number;
}

export interface IResume {
  title: string;
  size: string;
  link: string;
  updateAt: number;
}

export interface IUserInfoByLogin {
    courseCount?: number
    joinCamp?: any[]
    joinTeam?: any[]
    myTeam?: any[]
    joinTeamCount?: number
    lastLogin?: string
    myTeamCount?: number
    totalInvitationCount?: number
    totalVideoCount?: number
    totalVideoTime?: number
    userInfo?: IUser
}

export enum TeamUserRole {
    TEAM_LEADER = 'leader',
    TEAM_MEMBER = 'member',
}