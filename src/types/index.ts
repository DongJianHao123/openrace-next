import { IProjectTeam } from "./projectTeam";

export enum ChallengeStatus {
  PUBLISHED = 1, // 已发布
  CLAIMED = 2, // 攻关中 (已揭榜)
  IN_ACCEPTANCE = 3, // 验收中
  FINISHED = 4 // 已结束
}

export enum OpenStatus {
  Close = 0, // 已关闭
  Open = 1, // 已开启
}

export enum PeriodType {
  MONTH = 1,
  YEAR = 2,
  DAY = 3
}

export enum UserRole {
  ISSUER = 'Issuer', // Government/Enterprise
  SOLVER = 'Solver'  // University/Team/Individual
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  token?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
}

export interface Team {
  id: string;
  name: string;
  leader: string; // User ID
  members: Member[];
  description: string;
  establishedDate?: string;
  researchArea?: string;
  challengeId?: string | number; // Updated to match Challenge ID type
  challengeTitle?: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string; // Initial or Image URL
  organization: string;
  specialty: string[];
  background: string; // Resume/Bio
  researchDirection: string;
  honors: string[]; // Personal Honors
  achievements: string[]; // Technical Achievements
  projects: string[]; // Participating Projects
  teamId?: string; // If they lead a team
  teamName?: string;
}

export interface SolverProgress {
  id: string;
  challengeId: string | number;
  teamId: string;
  teamName: string;
  avatar: string;
  progress: number; // 0-100
  statusText: string;
  lastUpdate: string;
}

// 新的榜题结构
export interface Challenge {
  id?: number; // 榜题ID
  name?: string; // 榜题名称
  amount?: number; // 榜题金额 (元)
  status?: number; // 状态: 1-已发布, 2-待揭榜, 3-攻关中, 4-验收中, 5-已结束
  orgId?: number; // 发榜单位ID
  contactWay?: string; // 联系方式
  type?: number; // 榜题类型 (对应之前的 category)
  fieldType?: number; // 技术方向 (对应之前的 domain)
  projectBeginTime?: number; // 项目开始时间 (时间戳)
  projectLastTime?: number; // 项目截止时间 (时间戳)
  period?: number; // 周期数值
  periodType?: number; // 周期单位类型
  description?: string; // 详细描述
  technicalIndicators?: string; // 验收标准
  personnelRequirements?: string; // 揭榜方要求 (人员要求)
  announcementCount?: number; // 公告/揭榜数量
  tags?: string; // 标签 (逗号分隔的字符串) 
  finishTime?: number | null; // 结题时间
  city?: string; // 所在城市/区域
  createUserId?: number; // 创建人ID
  createTime?: number; // 创建时间
  updateTime?: number; // 更新时间
  updateUserId?: number; // 更新人ID
  fileSource?: string; // 附件/文件来源
  weight?: number; // 榜题权重
  openStatus?: number; // 榜题开放状态: 0-已关闭, 1-已开启


  // UI 辅助字段 (非后端返回，前端mock需要保留用于展示图片等)
  coverImage?: string;
  cover?: string; // 榜题封面文件对象
  myProgress?: number; // 当前用户的进度
  publicityResults?: string; // 结果公示

  isJoined?: boolean; // 当前用户是否已加入该榜题
  joinTeams?: IProjectTeam[]; // 已加入队伍列表
  organization?: IOrganization;

  teamType?: number; // 是否多队伍 1-单队伍, 2-多队伍
  paymentType?: number; // 支付类型 
  paymentInstruction?: string; // 支付进度说明
}
export interface IOrganization {
  orgId?: number; // 发榜单位ID
  contactName?: string; // 负责人
  contactWay?: string; // 联系方式
  loginName?: string; // 索引名
  name?: string; // 组织名称
  description?: string; // 组织描述
  fieldType?: number; // 技术方向 (对应之前的 domain)
  tags?: string; // 标签 (逗号分隔的字符串)
  createTime?: number; // 创建时间
  updateTime?: number; // 更新时间
  status?: number; // 状态
  icon?: string; // 组织图标
  projectCount?: number; // 项目数量
  projectFinishCount?: number; // 完成项目数量
  userId?: number; // 创建人ID
  token?: string; // 登录凭证
}

export interface StatMetric {
  label: string;
  value: string;
  trend?: string;
  icon?: string;
}

export interface PlatformStats {
  totalProjectCount: number;
  totalAmountCount: number;
  totalJoinTeamCount: number;
  totalTeamUserCount: number;
  totalOrganizationCount: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface News {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  image: string;
  content: string; // HTML or Markdown
  author: string;
  views: number;
}

export interface Message {
  id: string;
  type: 'application' | 'system';
  fromUser: string;
  fromUserName: string;
  content: string; // Application reason
  date: string;
  read: boolean;
  teamId?: string;
  teamName?: string;
}

export interface SubmissionHistory {
  id: string;
  date: string;
  phase: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// safe
export declare type SafeAny = any;
export declare type IDType = string | number;
export declare type SafeArray = SafeAny[];
export declare type SafeObject = { [key: string | number]: SafeAny };
export declare type SafeTimer = ReturnType<typeof setTimeout | typeof setInterval>;

// common types
export type ResponseListType<T> = {
  count: number;
  hasMore: number;
  limit: number;
  list: T[];
  page: number;
  total: number;
  totalPage: number;
};

export type PageListParams = {
  current?: number;
  pageSize?: number;
  page?: number;
  limit?: number;
  createTimeFilter?: any;
  createAtFilter?: any;
  orderby?: string;
};

export interface ChartDataItem {
  x: string | number;
  y: number;
}

export interface NumberFilter {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}


