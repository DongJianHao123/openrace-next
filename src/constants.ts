import { StatMetric } from "./types";

export const DOMAINS = ['All', '半导体', '操作系统', '量子计算', '先进制造', '新能源', '生物医药', 'AI/OS'];
export const CATEGORIES = ['All', '基础研究', '应用研发', '前沿探索', '装备制造', '新材料', '软件开发'];
export const REGIONS = ['All', '北京', '深圳', '济南'];
export const AMOUNT_RANGES = ['All', '< 1万', '1-10万', '10-30万', '> 30万'];

export const CHART_DATA_DOMAIN = [
  { name: '半导体', value: 35 },
  { name: 'AI/OS', value: 25 },
  { name: '新能源', value: 20 },
  { name: '先进制造', value: 15 },
  { name: '其他', value: 5 },
];

export const CHART_DATA_STATUS = [
  { name: '待揭榜', value: 120 },
  { name: '攻关中', value: 80 },
  { name: '验收中', value: 30 },
  { name: '已结题', value: 24 },
];

export enum TeamStatus {
  HIDDEN = 0,
  WORKING = 1,
  REJECTED = 2,
  COMPLETED = 10,
}


export const TEAM_STATUS_OPTIONS = [
  { label: '隐藏', value: TeamStatus.HIDDEN, color: 'gray' },
  { label: '进行中', value: TeamStatus.WORKING, color: 'blue' },
  { label: '已中止', value: TeamStatus.REJECTED, color: 'red' },
  { label: '已完成', value: TeamStatus.COMPLETED, color: 'green' },
]

export const ChallengeTeamType = {
  SINGLE_TEAM: 1,
  MULTI_TEAM: 2,
}

export const PLATFORM_STATS: StatMetric[] = [
  { label: 'stats_published', value: '', trend: '', icon: 'FileText' },
  { label: 'stats_fund', value: `¥`, trend: '', icon: 'Wallet' },
  { label: 'stats_claims', value: '', trend: '', icon: 'Target' },
  { label: 'stats_experts', value: '', trend: '', icon: 'Users' },
  { label: 'stats_partners', value: '', trend: '', icon: 'Building' }
];

export const TYPE_MAP: Record<number, string> = {
  1: '基础研究',
  2: '应用研发',
  3: '前沿探索',
  4: '装备制造',
  5: '软件开发'
};

export const FIELD_MAP: Record<number, string> = {
  1: 'AI/OS',
  2: '操作系统',
  3: '虚拟化技术'
};