'use client'
import { apiDealMessage } from '@/api/webApi/message';
import SubmitHistory from '@/components/SubmitHistory';
import { useMessageStore } from '@/store/messages.store';
import { useUserStore } from '@/store/user.store';
import { IProjectTeam } from '@/types/projectTeam';
import { Utils } from '@/utils';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { CheckOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Form, Input, message, Modal, Progress } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Award, Briefcase, Check, Clock, MapPin, MessageSquare, School2Icon, Target, User, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Upload } from 'antd/lib';
import { apiUpdateUser } from '@/api/webApi/user';
import { RcFile } from 'antd/es/upload';
import { fileUpload } from '@/utils/oss';
import Link from 'next/link';
import { useLanguage } from '@/store/contexts/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import useWindow from '@/utils/hooks/useWIndow';
import jsCookie from 'js-cookie';

// Define Props for extracted component
interface TeamCardProps {
    team: IProjectTeam;
    isLeader: boolean;
    t: any;
    onDetailClick: (team: IProjectTeam) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, isLeader, t, onDetailClick }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                    {team.teamName?.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{team.teamName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{team.description}</p>
                </div>
            </div>
            {isLeader && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                    {t.profile.teams.detail_modal.role_leader}
                </span>
            )}
        </div>

        <div className="mb-4 flex-grow">
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{team.description}</p>
            {/* 项目进度 */}
            <Flex className="mb-4" align="center">
                <p className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 项目进度：
                </p>
                <Progress className='flex-1' percent={team.progress || 0} status="active" />
            </Flex>
            {team.raceProject ? (
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 flex items-center">
                        <Target className="w-3 h-3 mr-1" /> {t.profile.teams.challenge_link}
                    </p>
                    <Link href={`/${useGetOrg().getOrganizationLoginNameById(team.orgId || 0)}/task/${team.raceProject.weight}`} className="text-sm font-medium text-blue-600 hover:underline line-clamp-1 block">
                        {team.raceProject.name}
                    </Link>
                </div>
            ) : (
                <div className="bg-amber-50 p-2 rounded-md border border-amber-100 text-xs text-amber-700">
                    未关联榜题
                </div>
            )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-500">
                <Users className="w-4 h-4 mr-1.5" />
                {t.profile.teams.members_count.replace('{count}', (team.teamUsers || []).length.toString())}
            </div>
            <button onClick={() => onDetailClick(team)} className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                {t.profile.teams.view_detail} <Briefcase className="w-3.5 h-3.5 ml-1" />
            </button>
        </div>
    </div>
);

const UserProfile: React.FC = () => {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'tasks');
    const [selectedTeam, setSelectedTeam] = useState<IProjectTeam | null>(null);
    const [showTeamDetailModal, setShowTeamDetailModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [userEditForm] = Form.useForm();
    const { history } = useWindow();

    const { user, userTeams: { userCreatedTeams = [], userJoinedTeams = [] } } = useUserStore();

    const { messages, readMessage } = useMessageStore();

    useEffect(() => {
        // Update URL when activeTab changes
        history.replaceState && history.replaceState({}, '', '?' + 'tab=' + activeTab);
    }, [activeTab, history]);


    const openTeamDetail = (team: IProjectTeam) => {
        setSelectedTeam(team);
        setShowTeamDetailModal(true);
    };

    const handleDealMessage = (messageId: number, dealResult: number) => {
        Modal.confirm({
            title: `${dealResult === 1 ? '同意' : '拒绝'}该组队申请吗？`,
            okText: '确认',
            okType: dealResult === 1 ? 'primary' : 'danger',
            onOk: () => {
                apiDealMessage({ dealContent: '', dealResult, messageId }).then(res => {
                    message.success('操作成功');
                    readMessage(messageId, 1, dealResult);
                });
            },
            onCancel: () => {
                // Do nothing
            },
        });
    };

    const handleEditUserSubmit = (values: { name: string, avatar: string }) => {
        apiUpdateUser({ name: values.name, avatar: values.avatar }).then(res => {
            message.success('操作成功');
            setShowEditUserModal(false);
        });
    };

    const handleUploadAvatar = (file: RcFile) => {
        fileUpload(file).then(res => {
            userEditForm.setFieldValue('avatar', res);
            setAvatar(res);
        });
        return false
    };

    useEffect(() => {
        if (showEditUserModal) {
            userEditForm.setFieldsValue({ name: user?.name, avatar: user?.avatar || '' });
            setAvatar(user?.avatar || '');
        }

    }, [showEditUserModal]);

    useEffect(() => {
        if(!jsCookie.get('web-token')) {
            message.error('请先登录');
        }
    }, []);



    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full border-4 border-white shadow-md" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md">
                                {user?.name ? user.name.charAt(0) : '我'}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <Flex align="center" gap={2}>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{user?.name || '用户'}</h1>
                            <Button type='link' size="middle" onClick={() => setShowEditUserModal(true)}><EditOutlined className='text-2xl' /></Button>
                        </Flex>
                        <p className="text-slate-500 font-medium text-sm mb-3 flex items-center gap-2">
                            <span className="flex items-center">
                                <School2Icon className="w-4 h-4 mr-1" />  {user?.userConfig?.school || '无'} | {user?.userConfig?.major || '无'}
                            </span>
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> {user?.userConfig?.city || '无'}
                            </span>
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                已认证攻关人
                            </span>
                            {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                计算机博士
                            </span> */}
                        </div>
                    </div>
                    <div className="flex gap-8 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-slate-900">{userJoinedTeams.concat(userCreatedTeams).filter(t => t.status === 1).length}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">进行中任务</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-slate-900">{userJoinedTeams.length + userCreatedTeams.length}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">参与揭榜</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto">
                    {[
                        { id: 'tasks', label: "揭榜任务" },
                        { id: 'messages', label: "消息通知" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {
                    //activeTab === 'tasks' && (
                    // <div className="space-y-4">
                    //     {myTasks.length > 0 ? (
                    //         myTasks.map(task => (
                    //             <div key={task.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                    //                 <div>
                    //                     <div className="flex items-center gap-2 mb-2">
                    //                         <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{FIELD_MAP[task.fieldType]}</span>
                    //                         <span className={`text-xs font-semibold px-2 py-0.5 rounded ${task.myProgress && task.myProgress >= 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    //                             {task.myProgress && task.myProgress >= 100 ? '已完成' : '进行中'}
                    //                         </span>
                    //                     </div>
                    //                     <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 mb-1">
                    //                         <Link to={`/task/${task.id}`}>{task.name}</Link>
                    //                     </h3>
                    //                     <div className="flex items-center gap-6 text-sm text-slate-500">
                    //                         <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> 截止: {new Date(task.projectLastTime).toLocaleDateString()}</span>
                    //                         <span className="flex items-center"><Target className="w-3.5 h-3.5 mr-1.5" /> 进度: {task.myProgress || 0}%</span>
                    //                     </div>
                    //                     {/* Progress Bar */}
                    //                     <div className="w-full md:w-64 bg-slate-100 rounded-full h-2 mt-3">
                    //                         <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${task.myProgress || 0}%` }}></div>
                    //                     </div>
                    //                 </div>
                    //                 <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                    //                     <button
                    //                         onClick={() => openProgressModal(task)}
                    //                         className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                    //                     >
                    //                         <Upload className="w-4 h-4 mr-2" /> {t.profile.submit_progress}
                    //                     </button>
                    //                 </div>
                    //             </div>
                    //         ))
                    //     ) : (
                    //         <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    //             <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    //             <p className="text-slate-500">{t.profile.no_tasks}</p>
                    //             <Link to="/tasks" className="text-blue-600 font-medium hover:underline mt-2 inline-block">前往榜题中心</Link>
                    //         </div>
                    //     )}
                    // </div>
                    //)
                }

                {/* Team Tab */}
                {activeTab === 'tasks' && (
                    <div className="space-y-10">
                        {userJoinedTeams.length === 0 && userCreatedTeams.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                                <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">{t.profile.no_team}</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-6">加入或组建团队，共同攻克国家难题。</p>
                                <Link href="/tasks" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
                                    前往揭榜组队
                                </Link>
                            </div>
                        )}

                        {/* Created Teams */}
                        {userCreatedTeams.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                        <Award className="w-5 h-5 mr-2 text-blue-600" /> 我创建的团队
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userCreatedTeams.map(team => (
                                        <TeamCard
                                            key={team.id}
                                            team={team}
                                            isLeader={true}
                                            t={t}
                                            onDetailClick={openTeamDetail}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Joined Teams */}
                        {userJoinedTeams.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-green-600" /> {t.profile.teams.joined}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userJoinedTeams.map(team => (
                                        <TeamCard
                                            key={team.id}
                                            team={team}
                                            isLeader={false}
                                            t={t}
                                            onDetailClick={openTeamDetail}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        {messages.length > 0 ? (
                            messages.map(msg => (
                                <Badge.Ribbon text={msg.isRead === 0 ? '未读' : '已读'} key={'profile_message_' + msg.messageId} placement='start' color={msg.isRead === 0 ? 'blue' : 'gray'} >
                                    <div className={`relative bg-white rounded-lg py-6 px-8 border ${msg.isRead === 0 ? 'border-slate-200' : 'border-blue-200 shadow-sm'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-full ${msg.type === 0 ? 'bg-slate-100' : 'bg-blue-100'}`}>
                                                    <MessageSquare className={`w-5 h-5 ${msg.type === 0 ? 'text-slate-600' : 'text-blue-600'}`} />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-900 mb-1">{msg.fromUserName} <span className="text-xs font-normal text-slate-500 ml-2">{Utils.date.format(msg.createTime || 0)}</span></h4>
                                                    {/* {msg.teamName && ( */}
                                                    {/* <p className="text-xs text-blue-600 mb-2">申请加入: {msg.teamName || '龙小组'}</p> */}
                                                    {/* )} */}
                                                    <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-md border border-slate-100">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            </div>
                                            {msg.type === 1 && msg.isRead === 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => handleDealMessage(msg.messageId!, 1)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                                        <Check className="w-3 h-3 mr-1" /> 同意
                                                    </button>
                                                    <button onClick={() => handleDealMessage(msg.messageId!, 2)} className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50">
                                                        <X className="w-3 h-3 mr-1" /> 拒绝
                                                    </button>
                                                </div>
                                            )}
                                            {
                                                msg.type === 1 && msg.isRead === 1 && msg.isDeal === 1 && msg.dealResult === 1 && (
                                                    <div className="inline-flex items-center px-3 py-1.5 border  text-xs font-medium rounded shadow-sm text-white bg-green-600"><CheckOutlined /> 已同意</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </Badge.Ribbon>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">{t.profile.messages.no_messages}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                        <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p>暂无历史记录。</p>
                    </div>
                )}
            </div>

            {/* Upload Progress Modal */}
            {//showProgressModal && selectedChallenge && 
                // (
                //     <div className="fixed inset-0 z-50 overflow-y-auto">
                //         <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                //             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                //                 <div className="absolute inset-0 bg-slate-500 opacity-75" onClick={() => setShowProgressModal(false)}></div>
                //             </div>
                //             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                //             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                //                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                //                     <div className="sm:flex sm:items-start">
                //                         <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                //                             <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                //                                 {t.profile.progress_modal_title}
                //                             </h3>
                //                             <div className="mt-2">
                //                                 <p className="text-sm text-slate-500 mb-4">
                //                                     提交进度: <span className="font-semibold">{selectedChallenge.name}</span>
                //                                 </p>
                //                                 <textarea
                //                                     className="w-full border border-slate-300 rounded-md p-2 h-32 focus:ring-blue-500 focus:border-blue-500"
                //                                     placeholder="请描述当前阶段进展..."
                //                                 ></textarea>
                //                                 <div className="mt-4 border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer">
                //                                     <Upload className="w-8 h-8 mb-2" />
                //                                     <span>点击或拖拽上传文件</span>
                //                                 </div>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </div>
                //                 <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                //                     <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowProgressModal(false)}>
                //                         {t.profile.submit}
                //                     </button>
                //                     <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowProgressModal(false)}>
                //                         {t.profile.cancel}
                //                     </button>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // )
            }

            {/* Team Detail Modal */}
            {showTeamDetailModal && selectedTeam && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setShowTeamDetailModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <button onClick={() => setShowTeamDetailModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-500">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">{selectedTeam.teamName}</h3>
                                    <p className="text-slate-500 text-sm mt-2">简介：{selectedTeam.description}</p>
                                    <p className="text-slate-500 text-sm mt-2">技术方案：{selectedTeam.plan}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Members */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-blue-600" /> {t.profile.teams.detail_modal.members}
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedTeam?.teamUsers?.map(teamUser => (
                                                <li key={"team_user" + teamUser.teamUserId} className="flex items-center bg-slate-50 p-2 rounded-lg">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 mr-3">
                                                        {teamUser?.avatar ? <img src={teamUser.avatar} alt={teamUser.userName} className="w-7 h-7 rounded-full" /> : <User className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{teamUser?.userName}</p>
                                                        <p className="text-xs text-slate-500">{teamUser.role === "leader" ? "队长" : "成员"}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <SubmitHistory historys={selectedTeam.raceProjectTeamRecords || []} />
                                    </div>
                                </div>

                            </div>
                            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowTeamDetailModal(false)}>
                                    关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                title="编辑个人信息"
                open={showEditUserModal}
                onCancel={() => setShowEditUserModal(false)}
                footer={null}
            >
                {
                    user && (
                        <Form
                            labelCol={{ span: 4 }}
                            form={userEditForm}
                            className='mt-4'
                            initialValues={{ name: user.name }}
                            onFinish={handleEditUserSubmit}
                        // wrapperCol={{ span: 16 }}
                        >
                            <FormItem label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
                                <Input />
                            </FormItem>
                            {/* 头像 */}
                            <FormItem label="头像" name="avatar">
                                <Upload fileList={[]} multiple={false} beforeUpload={handleUploadAvatar}>
                                    <div className='flex items-center gap-2'>
                                        {avatar ? <img src={avatar} alt={user.name} className="w-12 h-12 rounded-full" /> : <User className="w-12 h-12" />}
                                        <Button icon={<UploadOutlined />}>点击上传</Button>
                                    </div>
                                </Upload>
                            </FormItem>
                            {/* 提交 */}
                            <FormItem name="submit">
                                <Flex align='center' justify='center'>
                                    <Button type="primary" htmlType="submit">提交</Button>
                                </Flex>
                            </FormItem>
                        </Form>
                    )
                }
            </Modal>
        </div>
    );
};

export default UserProfile;