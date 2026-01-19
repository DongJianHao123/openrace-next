
import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, User, Share2 } from 'lucide-react';
// import { api } from '../services/api';
import { News } from '../types';
import { Loading } from '../components/Loading';
import Link from 'next/link';

const NewsDetail: React.FC = () => {
    // const { id } = useParams<{ id: string }>();
    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchDetail = async () => {
    //         if (id) {
    //             const data = await api.getNewsDetail(id);
    //             setNewsItem(data || null);
    //             setLoading(false);
    //         }
    //     };
    //     fetchDetail();
    // }, [id]);

    if (loading) return <Loading text="加载文章中..." />;
    if (!newsItem) return <div className="text-center py-20">文章不存在</div>;

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Hero Image */}
                <div className="h-[300px] sm:h-[400px] w-full relative">
                    <img src={newsItem.image} alt={newsItem.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                        <Link href="/news" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4 mr-1" /> 返回资讯列表
                        </Link>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                {newsItem.category}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                            {newsItem.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                            <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> {newsItem.author}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {newsItem.date}</span>
                            <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {newsItem.views} 阅读</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-12">
                     <div 
                        className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: newsItem.content }} 
                     />
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-100 p-8 flex justify-between items-center">
                    <span className="text-slate-500 text-sm">本文仅代表作者观点</span>
                    <button className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        <Share2 className="w-4 h-4 mr-2" /> 分享文章
                    </button>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;