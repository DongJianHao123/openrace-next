'use client'
import { apiGetUserJoinTeams } from '@/api/webApi/projectTeam';
import { apiGetUserInfo } from '@/api/webApi/user';
import { IProjectTeam } from '@/types/projectTeam';
import { IUser } from '@/types/user';
import jsCookie from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMessageStore } from './messages.store';

// 1. 定义状态类型
interface UserState {
    // 状态字段
    user: IUser | null;
    userTeams: {
        userCreatedTeams: IProjectTeam[];
        userJoinedTeams: IProjectTeam[];
    }
    isLogin: boolean;
    token: string | null;
    // 同步方法（修改状态）
    loginSuccess: (user: IUser, token: string) => void;
    logout: () => void;
    // 异步方法（如请求接口）
    fetchUserInfo: () => Promise<void>;
    loadUserTeams: () => Promise<void>;
}

// 2. 创建 Store
export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            // 初始状态
            user: null,
            userTeams: {
                userCreatedTeams: [],
                userJoinedTeams: []
            },
            isLogin: false,
            token: null,
            // 同步修改状态：通过 set 函数更新
            loginSuccess: (user, token) => {
                jsCookie.set('web-token', token);
                set({
                    isLogin: true,
                    user,
                    token
                })
                useUserStore.getState().fetchUserInfo();
            },
            // 重置状态
            logout: () => {
                jsCookie.remove('web-token');
                set({
                    user: null,
                    isLogin: false,
                    token: null,
                    userTeams: {
                        userCreatedTeams: [],
                        userJoinedTeams: []
                    }
                })
            },
            // 异步操作：直接在方法中写异步逻辑
            fetchUserInfo: async () => {
                try {
                    const res = await apiGetUserInfo();
                    if (res?.data) {
                        set({ user: res.data, isLogin: true });
                        useUserStore.getState().loadUserTeams();
                        useMessageStore.getState().loadMessages();
                    }
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                }
            },
            loadUserTeams: async () => {
                const userId = useUserStore.getState().user?.userId;
                apiGetUserJoinTeams().then((res2) => {
                    const joinedTeams = res2?.data?.filter((item) => item.userId !== userId) || [];
                    const createdTeams = res2?.data?.filter((item) => item.userId === userId) || [];
                    set({
                        userTeams: {
                            userCreatedTeams: createdTeams || [],
                            userJoinedTeams: joinedTeams || []
                        }
                    })
                })
            },
        }),
        {
            name: 'user-storage', // 存储名称
        }
    )
)

// 3. 使用 Store
// 在组件中通过 useUserStore 获取和修改状态
// 例如： const { user, login, logout } = useUserStore();
