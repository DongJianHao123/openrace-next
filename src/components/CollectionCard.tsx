'use client'
import React from 'react';
import { Layers, Eye, Building2 } from 'lucide-react';
import { ICollection } from '@/types/collection';
import useGetOrg from '@/utils/hooks/useGetOrg';
import Link from 'next/link';

interface CollectionCardProps {
    collection: ICollection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
    const { getOrganizationById } = useGetOrg();
    const currentOrg = getOrganizationById(collection.orgId!)
    const orgName = currentOrg?.name || '未知单位';

    return (
        <Link
            href={`/${currentOrg?.loginName}/collection/${collection.code}`}
            className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            <div className="h-40 w-full overflow-hidden relative">
                <img
                    src={collection.cover}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center shadow-sm">
                        <Layers className="w-3 h-3 mr-1" /> 技术合集
                    </span>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-slate-500 mb-2">
                    <Building2 className="w-3 h-3 mr-1.5" />
                    <span className="truncate">{orgName}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 line-clamp-1 transition-colors">
                    {collection.title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                    {collection.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {collection.tag?.split(',').slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
                <div className="flex items-center font-medium text-purple-600">
                    <Layers className="w-3.5 h-3.5 mr-1" />
                    {collection?.itemResList?.length} 个榜题
                </div>
                {/* <div className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    {collection.views} 阅读
                </div> */}
            </div>
        </Link>
    );
};
