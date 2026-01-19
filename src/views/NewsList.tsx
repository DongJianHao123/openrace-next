
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Calendar, Eye, ChevronRight } from 'lucide-react';
// import { api } from '../services/api';
import { News } from '../types';
import { Loading } from '../components/Loading';
import Link from 'next/link';

const NewsList: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // const data = await api.getNews();
                // setNews(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <Loading text="正在获取最新资讯..." />;

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">平台动态与资讯</h1>
                    <p className="text-slate-600">聚焦科技前沿，掌握政策风向</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map(item => (
                        <Link key={item.id} href={`/news/${item.id}`} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-xs text-slate-500 mb-3 space-x-3">
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.date}</span>
                                    <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {item.views}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                                    {item.summary}
                                </p>
                                <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                                    阅读全文 <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsList;