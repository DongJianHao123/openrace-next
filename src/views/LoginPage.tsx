'use client'
import { apiSendVerificationCode, apiUserLogin } from '@/api/webApi/user';
import { useUserStore } from '@/store/user.store';
import { Hexagon, Lock, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useToast } from '@/store/contexts/ToastContext';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const { showToast } = useToast();
    const [loginMethod, setLoginMethod] = useState<'code' | 'password' | 'email'>('code');
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { loginSuccess } = useUserStore()
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';
    const router = useRouter()
    // Form Data
    const [formData, setFormData] = useState({
        mobile: '',
        code: '',
        password: '',
        email: ''
    });

    const handleSendCode = async () => {
        if (!formData.mobile) {
            showToast('请输入手机号', 'error');
            return;
        }
        setSendingCode(true);
        try {
            await apiSendVerificationCode(formData.mobile);
            showToast('验证码已发送', 'success');
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (e) {
            showToast('发送失败', 'error');
        } finally {
            setSendingCode(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate based on method
            if (loginMethod === 'code' && (!formData.mobile || !formData.code)) throw new Error('请填写完整信息');
            if (loginMethod === 'password' && (!formData.mobile || !formData.password)) throw new Error('请填写完整信息');
            if (loginMethod === 'email' && (!formData.email || !formData.password)) throw new Error('请填写完整信息');

            const loginRes = await apiUserLogin({
                phone: formData.mobile,
                code: formData.code,
                password: formData.password,
                type: loginMethod
            });
            if (loginRes?.data && loginRes.code === 200) {
                const user = loginRes?.data || {};
                loginSuccess(user, user.token || '');
                // In a real app, verify user token here or save to context
                showToast('登录成功', 'success');
                router.push(from);
            } else {
                showToast('登录失败', 'error');
            }
        } catch (error: any) {
            showToast(error.message || '登录失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <Hexagon className="h-10 w-10 text-blue-600 fill-current" />
                    <span className="font-bold text-3xl tracking-tight text-slate-900">OpenRace</span>
                </Link>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
                    欢迎回来
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    登录账号以管理您的榜题或参与揭榜
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            className={`flex-1 py-3 text-sm font-medium border-b-2 ${loginMethod === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setLoginMethod('code')}
                        >
                            手机验证码
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-medium border-b-2 ${loginMethod === 'password' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setLoginMethod('password')}
                        >
                            手机密码
                        </button>
                        {/* <button
                            className={`flex-1 py-3 text-sm font-medium border-b-2 ${loginMethod === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setLoginMethod('email')}
                        >
                            邮箱密码
                        </button> */}
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Mobile Inputs */}
                        {(loginMethod === 'code' || loginMethod === 'password') && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">手机号码</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2.5"
                                        placeholder="请输入手机号码"
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Verification Code Input */}
                        {loginMethod === 'code' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">验证码</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex-grow focus-within:z-10">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ShieldCheck className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 rounded-none rounded-l-md sm:text-sm border-slate-300 py-2.5"
                                            placeholder="6位数字验证码"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={sendingCode || countdown > 0}
                                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-r-md text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-32 justify-center disabled:opacity-50"
                                    >
                                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        {loginMethod === 'email' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">邮箱地址</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2.5"
                                        placeholder="user@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Input */}
                        {(loginMethod === 'password' || loginMethod === 'email') && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">登录密码</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2.5"
                                        placeholder="请输入密码"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                    记住我
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    忘记密码?
                                </a>
                            </div>
                        </div> */}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? '登录中...' : '登 录'}
                            </button>
                        </div>
                    </form>

                    {/* <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    还没有账号?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                                立即注册新账号
                            </a>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;