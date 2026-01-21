'use client'
import { CollectionCard } from '@/components/CollectionCard';
import { ICollection } from '@/types/collection';
import { Building, ChevronRight, ExternalLink, Eye, Rocket, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ChallengeCard } from '../components/ChallengeCard';
import { Challenge, IOrganization, News } from '../types';
import HomePlatformStats from '@/components/HomePlatformStats';

interface IProps {
  challenges: Challenge[];
  collections: ICollection[];
  organizations: IOrganization[];
  news?: News[];
}

const why_features = {
  1: { title: '真实榜题来源', desc: '每一道榜题都源自真实的技术前瞻与行业痛点。汇聚社区集体智慧，让每一个具有价值的技术需求都能被看见、被响应。' },
  2: { title: '全流程透明监督', desc: '从揭榜到结题，实时公示进度、中期评估结果及评审过程，确保攻关质量与公平公正。' },
  3: { title: '资源支持', desc: '联合多个技术社区，提供实验平台、数据集、技术指导等资源，降低攻关门槛。' },
  4: { title: '灵活的资金支持体系', desc: '将激励与研发进度深度绑定，确保攻关资金透明、准时、高效到账，保障科研投入的价值回报。' },
}

const guide_steps_issuer = [
  { title: '注册认证', desc: '完成企业/机构资质认证' },
  { title: '发布需求', desc: '填写技术指标与赏金' },
  { title: '专家论证', desc: '平台专家审核需求合理性' },
  { title: '选定揭榜方', desc: '评估揭榜方案并签约' },
  { title: '项目验收', desc: '阶段性考核与最终交付' }
]
const guide_steps_solver = [
  { title: '注册认证', desc: '实名认证与能力评估' },
  { title: '筛选榜题', desc: '查找匹配的技术难题' },
  { title: '提交方案', desc: '编写技术路线与计划' },
  { title: '签署协议', desc: '确立权责与资金安排' },
  { title: '提交成果', desc: '按里程碑交付研发成果' }
]



const HomePage: React.FC<IProps> = (props: IProps) => {
  const { challenges, collections, organizations, news } = props;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden lg:h-[550px] h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        {/* Radial gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-white mb-6">
              {/*  汇聚全球创新力量 */}
              英雄不论出处
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-100 mt-2">
              {/* 攻克国家关键核心技术 */}
              谁有本事谁揭榜
            </span>
          </h1>
          <div className="max-w-5xl  mx-auto">
            <p className="text-1xl lg:text-lg text-slate-300 mb-10 lg:whitespace-nowrap overflow-hidden text-ellipsis opacity-90">
              {/* 英雄不论出处，谁有本事谁揭榜——聚焦“卡脖子”技术，打通从“科研”到“产业”的最后一公里，加速科技自立自强 */}
              为开源社区汇聚全球创新力量，以开放协作加速科技自立自强
              {/* 让创新成果在赛马中涌现，让优秀人才在实战中脱颖而出 */}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="-mt-24 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <HomePlatformStats />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center mb-6">
          {/* <Layers className="w-6 h-6 text-purple-600 mr-2" /> */}
          <div>
            <h2 className="text-3xl font-black text-slate-900">热门技术合集</h2>
            <p className="text-slate-500 mt-2">技术浪潮，在此集结</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">热门榜题</h2>
            <p className="text-slate-500">发现社区最迫切的技术需求。</p>
          </div>
          <Link href="/tasks" className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-1">
            查看全部 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map(challenge => (
            <ChallengeCard challenge={challenge} key={challenge.id} className='block h-full' />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            {/* <div className="flex items-center text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">
              <div className="w-8 h-[1px] bg-blue-600 mr-3"></div>
              Industry Leaders
            </div> */}
            <h2 className="text-3xl font-black text-slate-900">合作单位</h2>
            <p className="text-slate-500 mt-2"></p>
          </div>
          {/* <Link to="/challenges" className="group inline-flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
            查看全部入驻单位 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {organizations.map(org => (
            <Link
              target='_blank'
              key={org.orgId}
              href={`/${org.loginName}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all group overflow-hidden flex flex-col"
            >
              {/* Card Top: Gradient Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-2 shadow-inner group-hover:bg-white transition-colors">
                    <img src={org.icon} alt={org.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-flex items-center bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-100">
                    <ShieldCheck className="w-3 h-3 mr-1" /> 已认证
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1 truncate">{org.name}</h3>
                {/* <div className="text-xs font-bold text-blue-500 mb-3 flex items-center">
                  {FIELD_MAP[org.fieldType]} 领域
                </div> */}

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {org.description || '暂无详细介绍，致力于核心技术攻关与产业化落地。'}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {org.tags?.split(',').slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Stats */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 grid grid-cols-1 gap-4">
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 leading-none">{org.projectCount}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">累计发榜</p>
                </div>
                {/* <div className="text-center border-l border-slate-200">
                  <p className="text-sm font-black text-green-600 leading-none">{org.projectFinishCount || 0}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">成功结题</p>
                </div> */}
              </div>

              <div className="px-6 py-2 bg-blue-50/50 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-blue-600 flex items-center">
                  查看主页 <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="mt-12 p-8 bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">想让您的技术难题被全球顶尖团队看到？</h3>
            <p className="text-slate-400">已有 500+ 单位入驻 OpenRace，平均揭榜响应时间缩短 40%</p>
          </div>
          <Link to="/dashboard" className="relative z-10 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">
            立即申请入驻发榜
          </Link>
        </div> */}
      </section>

      {/* Why Choose OpenRace */}
      <section className="bg-white py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">为什么选择 OpenRace?</h2>
            <p className="mt-4 text-lg text-slate-600">值得信赖的技术成果转化加速平台</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, key: 1, color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: Eye, key: 2, color: 'text-green-600', bg: 'bg-green-100' },
              { icon: Rocket, key: 3, color: 'text-purple-600', bg: 'bg-purple-100' },
              { icon: Zap, key: 4, color: 'text-amber-600', bg: 'bg-amber-100' }
            ].map((item) => (
              <div key={item.key} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {why_features[item.key as keyof typeof why_features].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {why_features[item.key as keyof typeof why_features].desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">快速参与指南</h2>
          <p className="mt-4 text-slate-600">只需几步，即可开启创新之旅</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Issuer Guide */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Building className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 rounded-xl"><Building className="w-6 h-6 text-blue-600" /></div>
              <h3 className="text-xl font-bold text-slate-900">我是发榜方</h3>
            </div>

            <div className="space-y-0">
              {guide_steps_issuer.map((step, i) => (
                <div key={i} className="flex gap-4 relative pb-8 last:pb-0">
                  {i !== guide_steps_issuer.length - 1 && (
                    <div className="absolute top-8 left-[15px] bottom-0 w-0.5 bg-slate-200"></div>
                  )}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-sm font-bold text-blue-600 z-10">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solver Guide */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <UserCheck className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-100 rounded-xl"><UserCheck className="w-6 h-6 text-green-600" /></div>
              <h3 className="text-xl font-bold text-slate-900">我是揭榜方</h3>
            </div>

            <div className="space-y-0">
              {guide_steps_solver.map((step, i) => (
                <div key={i} className="flex gap-4 relative pb-8 last:pb-0">
                  {i !== guide_steps_solver.length - 1 && (
                    <div className="absolute top-8 left-[15px] bottom-0 w-0.5 bg-slate-200"></div>
                  )}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-green-500 flex items-center justify-center text-sm font-bold text-green-600 z-10">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center">
              <FileText className="mr-2 text-blue-600" /> {t.home.latest_news}
            </h3>
            <Link to="/news" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.length > 0 ? latestNews.slice(0, 3).map(news => (
              <Link key={news.id} to={`/news/${news.id}`} className="group block">
                <div className="rounded-lg overflow-hidden h-40 mb-3">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-2">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded mr-2">{news.category}</span>
                  <span>{news.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 transition-colors">{news.title}</h4>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-8 text-slate-500">加载中...</div>
            )}
          </div>
        </div>
      </section> */}
    </div>
  );
};


export default HomePage;