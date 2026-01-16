'use client'
import { useLanguage } from '@/store/contexts/LanguageContext';
import { Challenge, ChallengeStatus } from '@/types';
import { Utils } from '@/utils';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { Building2, Clock, MapPin, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ChallengeCardProps {
  className?: string;
  challenge: Challenge;
  onClick?: () => void;
}

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const { t } = useLanguage();
  const styles = {
    [ChallengeStatus.PUBLISHED]: 'bg-gray-100 text-gray-600',
    // [ChallengeStatus.WAITING_FOR_SOLVERS]: 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
    [ChallengeStatus.CLAIMED]: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20',
    [ChallengeStatus.IN_ACCEPTANCE]: 'bg-orange-100 text-orange-700',
    [ChallengeStatus.FINISHED]: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${styles[status as ChallengeStatus] || styles[1]}`}>
      {t.status[status as keyof typeof t.status]}
    </span>
  );
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onClick, className = '' }) => {
  const { getOrganizationById } = useGetOrg();
  const _challenge = challenge as Required<Challenge>;
  const orgName = getOrganizationById(_challenge.orgId)?.name;

  // Format Tags
  const tagsList = challenge.tags ? challenge.tags.split(',') : [];

  const deadlineStr =Utils.date.format(_challenge.projectLastTime, 'yyyy-MM-dd');

  return (
    <Link
      className={className}
      href={`/${challenge.organization?.loginName || 'ChenLongOS'}/task/${challenge.weight || 1}`}>
      <div
        onClick={onClick}
        className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      >
        {/* Cover Image */}
        <div className="h-40 w-full overflow-hidden relative">
          <img
            src={challenge.cover || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'}
            alt={challenge.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={_challenge.status} />
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="flex gap-2">
              {tagsList.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">


          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 line-clamp-2">
            {challenge.name}
          </h3>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center truncate max-w-[100%]">
                <Building2 className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
                <span className="truncate" title={orgName}>{orgName}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2 px-5 space-x-4">
          <div className="flex items-center text-amber-600 font-bold text-lg">
            <Wallet className="w-5 h-5 mr-1.5" />
            <span>¥{_challenge.amount / 10000}万</span>
          </div>
          <span className="flex items-center text-sm text-blue-600" title="Solvers">
            <Users className="w-3.5 h-3.5 mr-1" />
            {challenge.announcementCount}
          </span>
        </div>
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="text-xs text-slate-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />截止日期： {deadlineStr}
          </span>
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {challenge.city}
          </div>
        </div>
      </div>
    </Link>
  );
};
