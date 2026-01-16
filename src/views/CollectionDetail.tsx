'use client'
import { ChallengeCollectionItem } from '@/components/ChallengeCollectionItem';
import { ICollection } from '@/types/collection';
import { Utils } from '@/utils';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { ArrowLeft, Building2, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CollectionDetail: React.FC<{ collection: ICollection }> = (props) => {
    const { collection } = props;
    const collectionChallenges = collection?.itemResList?.sort((a, b) => (b?.weight || 0) - (a?.weight || 0)) || [];
    const { getOrganizationById } = useGetOrg();

    if (!collection) return <div className="p-8 text-center">Collection not found</div>;

    const orgName = getOrganizationById(collection.orgId!)?.name || '未知单位';

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-1" /> 返回首页
                    </Link>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-64 h-40 md:h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white/10 flex-shrink-0">
                            <img src={collection.cover} alt={collection.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center">
                                    <Layers className="w-3 h-3 mr-1" /> 技术合集
                                </span>
                                {collection.tag?.split(',').map(tag => (
                                    <span key={tag.trim()} className="bg-white/10 text-slate-200 text-xs px-2 py-0.5 rounded border border-white/20">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-3xl">
                                {collection.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                                <Link href={`/${collection.raceOrganization?.loginName}`} className="flex items-center hover:text-white transition-colors">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    {orgName}
                                </Link>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {Utils.date.format(collection.createTime || 0, 'yyyy-MM-dd')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center">
                            <Layers className="w-6 h-6 mr-2.5 text-blue-600" />
                            收录榜题任务
                            <span className="ml-3 text-sm bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                {collectionChallenges.length}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="space-y-6">
                    {collectionChallenges.length > 0 ? collectionChallenges.map(challenge => (
                        <ChallengeCollectionItem key={challenge.id} challenge={challenge.data || {}} />
                    )) : (
                        <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <Layers className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">暂无收录榜题</h3>
                            <p className="text-slate-400">该合集目前尚未关联具体的榜题任务</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionDetail;