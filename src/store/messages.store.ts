'use client'
import { apiGetMessageList, apiGetUnReadCount, apiReadMessage } from '@/api/webApi/message';
import { IMessage } from '@/types/message';
import { create } from 'zustand';

// 1. 定义状态类型
interface MessageState {
    messages: IMessage[] // 消息列表
    addMessage: (message: IMessage) => void; // 添加消息
    clearMessages: () => void; // 清空消息
    loadMessages: () => Promise<void>,
    readMessage: (messageId: number, isDeal?: number, dealResult?: number) => Promise<void>,
    updateAt: number
    unReadCount: number,
    loadUnReadCount: () => Promise<void>,
}

// 2. 创建 Store
export const useMessageStore = create<MessageState>()(
    (set) => ({
        // 初始状态
        messages: [],
        addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
        clearMessages: () => set({ messages: [] }),
        loadMessages: async () => {
            const res = await apiGetMessageList({ page: 1, limit: 20 });
            if (res?.data?.list) {
                set({ messages: res.data.list.reverse().sort((a, b) => (a.isRead || 0) - (b.isRead || 0)), updateAt: Date.now() });
            }
        },
        readMessage: async (messageId, isDeal = 0, dealResult = 0) => {
            const res = await apiReadMessage(messageId);
            if (res?.data) {
                set((state) => {
                    const message = state.messages.find((item) => item.messageId === messageId);
                    if (message) {
                        message.isRead = 1;
                        message.readTime = Date.now();
                        if (isDeal) {
                            message.isDeal = isDeal;
                            if (dealResult) {
                                message.dealResult = dealResult;
                            }
                        }
                    }
                    return ({
                        messages: [...state.messages],
                        updateAt: Date.now(),
                        unReadCount: state.unReadCount - 1,
                    })
                });
            }
        },
        updateAt: Date.now(),
        unReadCount: 0,
        loadUnReadCount: async () => {
            const res = await apiGetUnReadCount();
            if (res?.data) {
                set({ unReadCount: res.data || 0 });
            }
        }
    }
    ))
