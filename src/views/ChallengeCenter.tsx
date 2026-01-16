'use client'
import { useWebOrganizationsStore } from '@/store/organizations.store';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ChallengeCard } from '../components/ChallengeCard';
import { AMOUNT_RANGES, REGIONS } from '../constants';
import { Challenge, ChallengeStatus } from '../types';
import { useLanguage } from '@/store/contexts/LanguageContext';
import useWindow from '@/utils/hooks/useWIndow';

const FilterSection: React.FC<{
    label: string;
    options: { label: string, value: string | number }[];
    selected: string | number;
    onChange: (val: string | number) => void;
}> = ({ label, options, selected, onChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline py-3 border-b border-slate-100 last:border-0">
        <span className="w-24 text-sm font-semibold text-slate-700 flex-shrink-0 mb-2 sm:mb-0">{label}:</span>
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${selected === opt.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

interface IProps {
    data: Challenge[];
}

const ChallengeCenter: React.FC<IProps> = ({ data }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const challenges = data;
    const [filterData, setFilterData] = useState(challenges)
    const { history } = useWindow();
    // Filters (using numeric IDs where applicable)
    const [filters, setFilters] = useState({
        org: 0, // 0 = All
        tag: 'All', // 0 = All
        status: 0, // 0 = All
        amount: 'All',
        city: 'All'
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const { organizations } = useWebOrganizationsStore();

    const filterMaches = (challenge: Challenge) => {
        const matchesSearch = challenge?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (orgOptions.find(org => org.value === challenge.orgId)?.label || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesOrg = filters.org === 0 || challenge.orgId === filters.org;
        const matchesTag = filters.tag === 'All' || challenge.tags?.split(',').includes(filters.tag);
        const matchesStatus = filters.status === 0 || challenge.status === filters.status;
        const matchesRegion = filters.city === 'All' || challenge.city === filters.city;

        let matchesAmount = true;
        const amountWan = (challenge.amount || 0) / 10000;
        if (filters.amount === '< 1万') matchesAmount = amountWan < 1;
        else if (filters.amount === '1-10万') matchesAmount = amountWan >= 1 && amountWan < 10;
        else if (filters.amount === '10-30万') matchesAmount = amountWan >= 10 && amountWan < 30;
        else if (filters.amount === '> 30万') matchesAmount = amountWan >= 30;

        // 将所有搜索条件体现到url中,默认值不用加上
        const params: Record<string, string> = {};
        if (filters.org !== 0) params.org = filters.org.toString();
        if (filters.tag !== 'All') params.tag = filters.tag;
        if (filters.status !== 0) params.status = filters.status.toString();
        if (filters.amount !== 'All') params.amount = filters.amount;
        if (filters.city !== 'All') params.city = filters.city;

        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString();
        if (queryString) {
            history.replaceState && history.replaceState({}, '', '?' + queryString);
        } else {
            history.replaceState && history.replaceState({}, '', '/tasks');
        }

        return matchesSearch && matchesOrg && matchesTag && matchesStatus && matchesRegion && matchesAmount;
    }

    // Pagination Logic
    const totalPages = Math.ceil(filterData.length / itemsPerPage);
    const currentItems = filterData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const statusOptions = [
        { label: '全部', value: 0 },
        ...Object.values(ChallengeStatus).filter(v => typeof v === 'number').map(s => ({ label: t.status[s], value: s as number }))
    ];

    const orgOptions = organizations.map(org => ({ label: org.name!, value: org.orgId! }))
    orgOptions.unshift({ label: '全部', value: 0 })
    const regionOptions = [{ label: '全部', value: 'All' }, ...REGIONS.filter(r => r !== 'All').map(r => ({ label: r, value: r }))];
    const amountOptions = AMOUNT_RANGES.map(a => ({ label: a === 'All' ? '全部' : a, value: a }));

    const tagsOption = useMemo(() => {
        const tagsArr = challenges.reduce((acc, cur) => {
            return acc.concat(cur.tags?.split(',')[0] || '');
        }, [] as string[]);
        // 去重
        const tagsOptions = tagsArr.filter((tag, index) => tagsArr.indexOf(tag) === index).map(tag => ({ label: tag, value: tag }));
        tagsOptions.unshift({ label: '全部', value: 'All' });
        return tagsOptions;
    }, [challenges])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const org = params.get('org');
        const tag = params.get('tag');
        const status = params.get('status');
        const amount = params.get('amount');
        const city = params.get('city');
        if (org) setFilters(prev => ({ ...prev, org: Number(org) }));
        if (tag) setFilters(prev => ({ ...prev, tag }));
        if (status) setFilters(prev => ({ ...prev, status: Number(status) }));
        if (amount) setFilters(prev => ({ ...prev, amount }));
        if (city) setFilters(prev => ({ ...prev, city }));
    }, []);

    useEffect(() => {
        const filtered = challenges.filter(filterMaches);
        setFilterData(filtered);
    }, [filters, challenges, searchTerm]);

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">{t.center.title}</h1>
                    <p className="mt-2 text-slate-600">{t.center.subtitle}</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto mb-8 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-lg transition-shadow"
                        placeholder={t.center.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <FilterSection
                        label={"发榜单位"}
                        options={orgOptions}
                        selected={filters.org}
                        onChange={(val) => handleFilterChange('org', val)}
                    />
                    <FilterSection
                        label={t.center.filters.domain}
                        options={tagsOption}
                        selected={filters.tag}
                        onChange={(val) => handleFilterChange('tag', val)}
                    />
                    <FilterSection
                        label={t.center.filters.status}
                        options={statusOptions}
                        selected={filters.status}
                        onChange={(val) => handleFilterChange('status', val)}
                    />
                    <FilterSection
                        label={t.center.filters.amount}
                        options={amountOptions}
                        selected={filters.amount}
                        onChange={(val) => handleFilterChange('amount', val)}
                    />
                    <FilterSection
                        label={t.center.filters.region}
                        options={regionOptions}
                        selected={filters.city}
                        onChange={(val) => handleFilterChange('city', val)}
                    />
                </div>

                {/* Stats & Sort Bar */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-slate-600 font-medium">
                        {t.center.total_found.replace('{count}', filterData.length.toString())}
                    </span>
                    <select className="form-select border-slate-300 rounded-md text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500">
                        <option>{t.center.sort_default}</option>
                        <option>{t.center.sort_newest}</option>
                        <option>{t.center.sort_amount}</option>
                    </select>
                </div>

                {/* Results Grid */}
                {currentItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {currentItems.map(challenge => (
                                <ChallengeCard challenge={challenge} key={challenge.id} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-md text-sm font-medium ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <Search className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900">{t.center.no_results}</h3>
                        <p className="mt-1 text-sm text-slate-500">尝试调整筛选条件。</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeCenter;