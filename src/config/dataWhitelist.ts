// src/config/dataWhitelist.ts

import { Challenge, IOrganization } from "@/types";
import { ICollection } from "@/types/collection";

// 任务（challenges）白名单：仅保留渲染所需字段
export const CHALLENGES_WHITELIST: (keyof Challenge)[] = [
  'id',
  'name',
  'cover', // 嵌套字段会自动处理
  'orgId',
  'amount',
  'projectLastTime',
  'city',
  'tags',
  'weight',
  'announcementCount',
  'type',
  'status',  // 'organization'
];

// 收藏（collections）白名单
export const COLLECTIONS_WHITELIST: (keyof ICollection)[] = [
  'id',
  'title',
  'cover',
  'orgId',
  'description',
  'itemResList',
  'tag',
  'code'
];

// 机构（organizations）白名单
export const ORGANIZATIONS_WHITELIST: (keyof IOrganization)[] = [
  'orgId',
  'name',
  'icon',
  'description',
  'projectCount',
  'loginName',
];

// 页面级白名单映射（方便复用）
export const HOME_PAGE_WHITELIST = {
  challenges: CHALLENGES_WHITELIST,
  collections: COLLECTIONS_WHITELIST,
  organizations: ORGANIZATIONS_WHITELIST,
};

// 可扩展：其他页面的白名单（示例）
export const TASK_PAGE_WHITELIST = {
  tasks: ['id', 'title', 'status', 'deadline'],
};