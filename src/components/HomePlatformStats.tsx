
'use client'
import { apiGetRaceStatistics } from "@/api/webApi/task";
import { PLATFORM_STATS } from "@/constants";
import { StatMetric } from "@/types";
import { Building, FileText, Target, TrendingUp, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const HomePlatformStats = () => {
    const [platformStats, setPlatformStats] = useState<StatMetric[]>(PLATFORM_STATS);
    const getIcon = (iconName?: string) => {
        switch (iconName) {
            case 'FileText': return <FileText className="w-8 h-8 text-blue-500" />;
            case 'Wallet': return <Wallet className="w-8 h-8 text-amber-500" />;
            case 'Target': return <Target className="w-8 h-8 text-red-500" />;
            case 'Users': return <Users className="w-8 h-8 text-green-500" />;
            case 'Building': return <Building className="w-8 h-8 text-purple-500" />;
            default: return <TrendingUp className="w-8 h-8 text-blue-500" />;
        }
    };
    const loadPlatformStats = async () => {
        try {
            const { data } = await apiGetRaceStatistics();
            setPlatformStats([
                { label: '发榜数量', value: data?.totalProjectCount?.toString() || '', trend: '', icon: 'FileText' },
                { label: '发榜金额', value: `¥${(data?.totalAmountCount || 0) / 10000 || 0}万`, trend: '', icon: 'Wallet' },
                { label: '揭榜数量', value: data?.totalJoinTeamCount?.toString() || '', trend: '', icon: 'Target' },
                { label: '揭榜人才', value: data?.totalTeamUserCount?.toString() || '', trend: '', icon: 'Users' },
                { label: '合作单位', value: data?.totalOrganizationCount?.toString() || '', trend: '', icon: 'Building' }
            ]);
        } catch (error) {
            console.error("获取平台统计数据失败:", error);
        }
    };
    useEffect(() => {
        loadPlatformStats();
    }, []);
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-slate-100/50">
            {platformStats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-4 border-r md:last:border-r-0 border-slate-100 last:border-r-0">
                    <div className="mb-3 p-3 bg-blue-50 rounded-full">
                        {getIcon(stat.icon)}
                    </div>
                    <div className="flex items-baseline mb-1">
                        <span className="text-2xl font-bold text-slate-900">
                            {stat.value}
                        </span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HomePlatformStats;