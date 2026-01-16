
import { Utils } from '@/utils';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { Building2, ChevronRight, Clock, Target, Trophy, Users, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Challenge } from '../types';
import WangEditorView from './common/WangEditorView';
import { IProjectTeam } from '@/types/projectTeam';
import { apiGetProjectTeams } from '@/api/webApi/projectTeam';
import { Spin } from 'antd';
import Link from 'next/link';

interface ChallengeCollectionItemProps {
    challenge: Challenge;
}

export const ChallengeCollectionItem: React.FC<ChallengeCollectionItemProps> = ({ challenge }) => {
    const { getOrganizationById } = useGetOrg()
    const org = getOrganizationById(challenge.orgId || 0)
    const orgName = org?.name || '未知单位';
    const [solvers, setSolvers] = useState<IProjectTeam[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSolvers = () => {
        setLoading(true);
        apiGetProjectTeams({
            projectId: challenge.id,
            page: 1,
            pageSize: 3,
            orderby: 'progress:desc',
        }).then(res => {
            setSolvers(res.data?.list.filter(item => item.status !== 0) || []);
            setLoading(false);
        })
    }

    useEffect(() => {
        loadSolvers();
    }, [challenge.id])

    const link = `/${org?.loginName}/task/${challenge.weight}`


    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row group">
            {/* Left Section: Challenge Info */}
            <div className="flex-grow flex flex-col p-6 lg:border-r border-slate-100 lg:max-w-[65%]">
                <div className="flex items-center gap-2 mb-3">
                    {/* <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase border border-blue-100">
                        {fieldName}
                    </span> */}
                    <span className="text-slate-400 text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> 截止: {Utils.date.format(challenge.projectLastTime || 0)}
                    </span>
                </div>

                <Link href={link} className="block group-hover:text-blue-600 transition-colors">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight line-clamp-1">
                        {challenge.name}
                    </h3>
                </Link>

                <div className={`text-sm text-slate-500 line-clamp-${solvers.length > 2 ? solvers.length : 2} mb-6 leading-relaxed flex-1`}>
                    <WangEditorView value={challenge.description || ''} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-auto">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mr-3">
                            <Wallet className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">榜单金额</p>
                            <p className="text-sm font-bold text-slate-900">¥{(challenge.amount || 0) / 10000}万</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">发布单位</p>
                            <Link href={`/${org?.loginName}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 truncate block max-w-[100px]">
                                {orgName}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center col-span-2 sm:col-span-1">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">揭榜热度</p>
                            <p className="text-sm font-bold text-slate-900">{challenge.announcementCount} 支团队</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Top Solvers Progress */}
            <div className="bg-slate-50/50 p-6 lg:w-[35%] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Trophy className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> 领跑团队
                    </h4>
                    <Link href={link} className="text-[10px] font-bold text-blue-600 hover:underline">
                        查看全部揭榜详情
                    </Link>
                </div>

                <Spin spinning={loading} classNames={{
                    wrapper: 'flex-1'
                }}>
                    <div className="space-y-4 flex-grow">
                        {solvers?.length > 0 ? solvers.map((solver, idx) => (
                            <div key={solver.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 truncate">{solver.teamName}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                        {solver.progress || 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-amber-400' : 'bg-blue-400'}`}
                                        style={{ width: `${solver.progress || 0}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-4">
                                <Target className="w-8 h-8 text-slate-200 mb-2" />
                                <p className="text-[10px] text-slate-400 font-medium">虚位以待<br />立即成为首个揭榜者</p>
                            </div>
                        )}
                    </div>
                </Spin>
                <Link
                    href={link}
                    className="mt-4 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center group/btn"
                >
                    立即参与揭榜 <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
