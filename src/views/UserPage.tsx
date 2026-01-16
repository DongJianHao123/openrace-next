'use client'
import { TEAM_STATUS_OPTIONS, TeamStatus } from '@/constants';
import { useLanguage } from '@/store/contexts/LanguageContext';
import { ITeamUser } from '@/types/projectTeam';
import { IUser, TeamUserRole } from '@/types/user';
import { Utils } from '@/utils';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { GithubOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { BookOpen, Building2, MapPin, Target } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const getUserConfigArray = (value: string) => {
    try {
        const _str = value || '[]'
        const _goodAt = _str.substring(1, _str.length - 1).split(',')
        if (_goodAt.length === 1 && Utils.str.isEmpty(_goodAt[0])) {
            return []
        }
        return _goodAt.map((t) => {
            let index = t.indexOf('（')
            return index > -1 ? t.slice(0, index) : t
        })
    } catch (err) {
        return []
    }
}

const UserPage: React.FC<{ user: IUser, userTeams: ITeamUser[] }> = (props) => {
    const { t } = useLanguage();
    const { user, userTeams } = props;
    console.log(user, userTeams);
    const {getOrganizationById}=useGetOrg()


    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-100">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h1>
                        <div className="flex items-center text-xm text-slate-600 mb-4 gap-2">
                            <span className="flex items-center text-slate-500"><MapPin className="w-4 h-4 mr-1" /> {user.userConfig?.city}</span>
                            <span className="text-slate-500">|</span>
                            <span className="flex items-center text-slate-500"><Building2 className="w-4 h-4 mr-1" /> {user.userConfig?.school}</span>
                            <span className="text-slate-500">|</span>
                            <span className="flex items-center text-slate-500"><BookOpen className="w-4 h-4 mr-1" /> {user.userConfig?.major}</span>
                            {/* github */}
                            <span className="text-slate-500">|</span>
                            <Link href={`https://github.com/${user.userConfig?.githubName}`} target='_blank' className="flex items-center text-slate-500 underline"><GithubOutlined className="w-4 h-4 mr-1" /> {user.userConfig?.githubName}</Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {getUserConfigArray(user.userConfig?.goodAt || '[]')?.map(s => (
                                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Removed "Team Leader" card as requested */}
                </div>

                <div>
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Revealed List (Formerly Projects) */}
                        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                <Target className="w-5 h-5 mr-2 text-green-600" /> {t.experts.detail.projects}
                            </h2>
                            <div className="space-y-4">
                                {userTeams.map((userTeam) => {
                                    const team = userTeam.team || {}
                                    const project = team.raceProject || {}
                                    const teamUsers = team.teamUsers || []
                                    const currOrg= getOrganizationById(project.orgId || 0) || {}
                                    const teamStatus = TEAM_STATUS_OPTIONS.find(item => item.value === userTeam.status)
                                    return <div key={userTeam.teamUserId} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <Link href={`/${currOrg.loginName}/task/${project.weight}`}  target="_blank" className="font-bold text-slate-800 flex-1">{project.name}</Link>
                                            {/* 身份 */}
                                            <Tag color={teamStatus?.color || 'blue'}>
                                                {teamStatus?.label}
                                            </Tag>
                                        </div>

                                        <div className="flex items-center text-sm text-slate-500 mb-3">
                                            <span>队伍：</span>
                                            {/* <Users className="w-4 h-4 mr-1.5" /> */}
                                            <span className="text-slate-700 font-medium">{team.teamName}（{teamUsers.length || 0}人）</span>
                                            {/* <span className="bg-slate-100 px-2 rounded text-xs ">{userTeam.role === TeamUserRole.TEAM_LEADER ? '队长' : '队员'}</span> */}
                                        </div>
                                        {/* 成员 */}
                                        <div className="flex items-center text-sm text-slate-500 mb-3">
                                            <span>成员：</span>
                                            <ul className="flex flex-wrap gap-2">
                                                {teamUsers.map(user => (
                                                    <li key={user.userId}>{user.userName} {user.role === TeamUserRole.TEAM_LEADER ? <Tag color="blue">队长</Tag> : ''}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {teamStatus?.value !== TeamStatus.COMPLETED && (
                                            <div>
                                                <div className="flex justify-between items-center text-xs text-slate-500 mb-1 gap-2">
                                                    <span>当前进度</span>
                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1">
                                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${team.progress || 0}%` }}></div>
                                                    </div>
                                                    <span>{team.progress || 0}%</span>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                })}
                            </div>
                        </section>

                        {/* Resume / Background */}
                        {/* <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" /> {t.experts.detail.resume}
                            </h2>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {user.background}
                            </p>
                        </section> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserPage;
