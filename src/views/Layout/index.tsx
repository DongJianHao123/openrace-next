'use client'
import { useLanguage } from '@/store/contexts/LanguageContext';
import { useMessageStore } from '@/store/messages.store';
import { useWebOrganizationsStore } from '@/store/organizations.store';
import { useUserStore } from '@/store/user.store';
import useWindow from '@/utils/hooks/useWIndow';
import { Badge, Modal } from 'antd';
import jsCookie from 'js-cookie';
import { Bell, Hexagon, LogIn, Menu, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const pathname = usePathname();
    const { fetchUserInfo, user, isLogin, logout } = useUserStore();
    const { loadMessages, messages, loadUnReadCount, unReadCount } = useMessageStore();
    const { loadOrganizations } = useWebOrganizationsStore();
    const { t } = useLanguage();
    const timer = useRef<NodeJS.Timeout>(null);
    const router = useRouter();
    // Mock check if user is logged in (simply check path for demo, in real app use AuthContext)
    const isLoginPage = pathname === '/login';

    const isActive = (path: string) => pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600';

    const loginOut = () => {
        Modal.confirm({
            title: '确认退出登录吗？',
            okText: '确认',
            okType: 'danger',
            onOk: () => {
                useUserStore.getState().logout();
                router.push('/login');
            }
        });
    }
    // 每分钟定时刷新消息列表
    const startMessageTimer = () => {
        loadMessages();
        loadUnReadCount();
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (!isLogin) return;
        timer.current = setTimeout(() => {
            startMessageTimer()
        }, 30000);
    }

    useEffect(() => {
        if (!isLoginPage && jsCookie.get('web-token')) {
            fetchUserInfo();
            startMessageTimer();
        } else {
            logout();
        }
        loadOrganizations();
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        }
    }, []);

    // 监听路由 pathname/key 变化，触发滚动
    useEffect(() => {
        // 核心逻辑：滚动到页面顶部
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // 可选：平滑滚动
        });
    }, [pathname]); // 依赖 location.pathname：适配路径不变、参数变化的场景（如 /detail/1 → /detail/2）

    if (isLoginPage) return null;

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <Hexagon className="h-8 w-8 text-blue-700 fill-current" />
                            <span className="font-bold text-xl tracking-tight text-slate-900">{t.nav.brand}</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/' ? 'border-blue-500' : 'border-transparent'} ${isActive('/')}`}>
                                {t.nav.home}
                            </Link>
                            <Link href="/tasks" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/tasks' ? 'border-blue-500' : 'border-transparent'} ${isActive('/tasks')}`}>
                                {t.nav.challenges}
                            </Link>
                            {/* <Link to="/experts" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/experts' ? 'border-blue-500' : 'border-transparent'} ${isActive('/experts')}`}>
               揭榜人才
              </Link>
              <Link to="/news" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/news' ? 'border-blue-500' : 'border-transparent'} ${isActive('/news')}`}>
                资讯动态
              </Link> */}
                            {/* <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/dashboard' ? 'border-blue-500' : 'border-transparent'} ${isActive('/dashboard')}`}>
                {t.nav.dashboard}
              </Link> */}
                            {/* <Link to="/admin"  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-slate-500 hover:text-slate-800`}>
                <Shield className="w-4 h-4 mr-1" />
                管理后台
              </Link> */}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">

                        {/* Notification Dropdown */}
                        <div className="relative">
                            <button
                                className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none relative"
                                onClick={() => setShowNotifications(!showNotifications)}
                                onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                            >
                                <Bell className="h-6 w-6" />
                                {unReadCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 border border-slate-100 z-50 ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700">消息通知（ {unReadCount} 条未读）</span>
                                        <Link href="/profile?tab=messages" className="text-xs text-blue-600 hover:underline">查看全部</Link>
                                    </div>
                                    {messages?.map(msg => (
                                        <Link key={'message_' + msg.messageId} href="/profile?tab=messages" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                            <Badge dot={msg.isRead === 0}>
                                                <div className="flex items-start">
                                                    <MessageSquare className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 truncate">{msg.fromUserName}</p>
                                                        <p className="text-xs text-slate-500 truncate w-56">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </Badge>
                                        </Link>
                                    ))}
                                    {
                                        messages.length === 0 && (
                                            <div className="px-4 py-3 text-center text-sm text-slate-500">暂无消息</div>
                                        )
                                    }
                                </div>
                            )}
                        </div>

                        <Link href={isLogin ? "/profile" : "/login"}>
                            <div className="flex items-center gap-2 border-l pl-4 border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {user?.name ? user.name.charAt(0) : '登'}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700 leading-none">{user?.name || '未登录'}</span>
                                    <span className="text-xs text-slate-500 mt-0.5">{t.nav.profile}</span>
                                </div>
                            </div>
                        </Link>
                        <div onClick={() => loginOut()} className="text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
                            <LogIn className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-t border-slate-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50">
                            {t.nav.home}
                        </Link>
                        <Link href="/tasks" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
                            {t.nav.challenges}
                        </Link>
                        <Link href="/experts" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
                            {t.nav.experts}
                        </Link>
                        <Link href="/news" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
                            资讯动态
                        </Link>
                        {/* <Link to="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
              {t.nav.dashboard}
            </Link> */}
                        <Link href="/profile" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
                            {t.nav.profile}
                        </Link>
                        {/* <Link to="/admin" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
              管理后台
            </Link> */}
                        <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300">
                            {t.nav.login}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const { organizations } = useWebOrganizationsStore()
    return (
        <footer className="bg-slate-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Hexagon className="h-6 w-6 text-blue-500 fill-current" />
                            <span className="font-bold text-xl">{t.nav.brand}</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            {t.home.hero_desc}
                        </p>
                    </div>
                    <div className='flex'>

                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">合作单位</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {
                                organizations.map((item) => (
                                    <li key={item.orgId}><a target='_blank' href={`/${item.loginName}`} className="hover:text-white">{item.name}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {/* <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">资源中心</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white">帮助中心</a></li>
              <li><a href="#" className="hover:text-white">政策法规</a></li>
              <li><a href="#" className="hover:text-white">API 文档</a></li>
            </ul>
          </div> */}
                    <div>
                        {/* <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">联系我们</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>service@maodou.io</li>
              <li>北京市海淀区东升大厦</li>
            </ul> */}
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                    &copy; 2025 OpenRace Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
