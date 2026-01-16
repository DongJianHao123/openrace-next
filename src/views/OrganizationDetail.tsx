'use client'
import { ICollection } from '@/types/collection';
import { Building2, FileText, Layers, Mail, Share2, ShieldCheck, Target, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { ChallengeCard } from '../components/ChallengeCard';
import { CollectionCard } from '../components/CollectionCard';
import { Challenge, IOrganization, News } from '../types';

const OrganizationDetail: React.FC<{ organization: IOrganization, challenges: Challenge[], collections: ICollection[] }> = ({ organization: org, challenges, collections }) => {
    const [activeTab, setActiveTab] = useState('challenges');
    const [news, setNews] = useState<News[]>([]);

    if (!org) return <div className="p-20 text-center text-slate-500">未找到该单位信息</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="relative">
                {/* Tech Banner Background */}
                <div className="h-64 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>

                {/* Organization Profile Card */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-20">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Logo */}
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-inner p-2 flex items-center justify-center border-4 border-slate-50 overflow-hidden flex-shrink-0">
                                <img src={org.icon} alt={org.name} className="w-full h-full object-contain" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{org.name}</h1>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> 已认证单位
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-600">
                                    <div className="flex items-center text-sm font-medium">
                                        <User className="w-4 h-4 mr-2 text-slate-400" />
                                        <span className="text-slate-400 mr-1.5">联系人:</span>
                                        {org.contactName}
                                    </div>
                                    <div className="flex items-center text-sm font-medium">
                                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                                        <span className="text-slate-400 mr-1.5">电子邮箱:</span>
                                        {org.contactWay}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {org.tags?.split(',').map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4 md:gap-0 md:flex-col md:border-l md:pl-10 border-slate-100 min-w-[160px]">
                                <div className="md:mb-4">
                                    <span className="block text-3xl font-black text-slate-900 leading-none">{org.projectCount}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 block">累计发榜</span>
                                </div>
                                <div className="border-l md:border-l-0 md:border-t border-slate-100 pl-4 md:pl-0 md:pt-4">
                                    <span className="block text-3xl font-black text-green-600 leading-none">{org.projectFinishCount}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 block">成功结题</span>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Nav / Tabs */}
                        <div className="mt-10 flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'challenges', label: '发布榜题', icon: Target, count: challenges.length },
                                { id: 'collections', label: '技术合集', icon: Layers, count: collections.length },
                                { id: 'intro', label: '单位介绍', icon: Building2 },
                                { id: 'news', label: '动态资讯', icon: FileText, count: news.length },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                            <div className="flex-grow"></div>
                            {/* <div className="hidden md:flex items-center pr-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="分享单位">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {activeTab === 'challenges' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {challenges.map(c => (
                            <ChallengeCard challenge={c} key={c.id} className="transition-transform hover:-translate-y-1" />
                        ))}
                        {challenges.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
                                <Target className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">该单位暂未发布任何榜题</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'collections' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {collections.map(c => (
                            <CollectionCard key={c.id} collection={c} />
                        ))}
                        {collections.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
                                <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">该单位暂未创建技术合集</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'intro' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Building2 className="w-64 h-64" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                            <Building2 className="w-6 h-6 mr-3 text-blue-600" /> 关于 {org.name}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg max-w-4xl">
                            {org.description}
                        </p>

                        <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400">主攻研究方向</h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {org.tags?.split(',').map((tag, i) => (
                                        <span key={i} className="text-slate-700 font-semibold flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400">官方平台加入日期</h4>
                                <p className="text-slate-700 font-semibold">{new Date(org.createTime!).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            {/* <div className="space-y-2">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400">单位信用评级</h4>
                                <p className="text-blue-600 font-black flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-1" /> AAA 级 (优秀)
                                </p>
                            </div> */}
                        </div>
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="space-y-6">
                        {news.map(n => (
                            <Link key={n.id} href={`/news/${n.id}`} className="block bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{n.category}</span>
                                            <span className="text-slate-400 text-xs font-medium">{n.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{n.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{n.summary}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {news.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
                                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">该单位暂无动态资讯发布</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default OrganizationDetail;