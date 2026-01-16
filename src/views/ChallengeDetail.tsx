'use client'
import { apiApplyToJoinTeam, apiGetProjectRecords, apiGetProjectTeams, apiJoinRaceProject, apiSubmitProjectRecord } from '@/api/webApi/projectTeam';
import WangEditorView from '@/components/common/WangEditorView';
import SubmitHistory from '@/components/SubmitHistory';
import { useUserStore } from '@/store/user.store';
import { IProjectTeam, IProjectTeamRecord } from '@/types/projectTeam';
import useGetOrg from '@/utils/hooks/useGetOrg';
import { fileUpload } from '@/utils/oss';
import { UploadOutlined } from '@ant-design/icons';
import { Upload as AntdUpload, Button, Flex, Input, message, Modal, Progress, Tag } from 'antd';
import { ArrowLeft, Award, Building2, Calendar, CheckCircle, Circle, Clock, Download, FileText, MapPin, Upload, UserIcon, UserPlus, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChallengeTeamType, FIELD_MAP, TEAM_STATUS_OPTIONS, TeamStatus, TYPE_MAP } from '../constants';
import { Challenge, ChallengeStatus } from '../types';
import { Utils } from '@/utils';
import { TeamUserRole } from '@/types/user';

interface IProps {
  challenge: Challenge;
}

const statusFlow = {
  published: '已发布',
  waiting: '等待揭榜',
  claimed: '揭榜攻关中',
  acceptance: '验收中',
  finished: '已结束'
}


const ChallengeDetail: React.FC<IProps> = (props) => {
  const { challenge: _challenge } = props;
  const [challenge, setChallenge] = useState(_challenge);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState<IProjectTeam>();
  const [joinReason, setJoinReason] = useState('');
  const [submitHistory, setSubmitHistory] = useState<IProjectTeamRecord[]>([]);

  const solvers = challenge?.joinTeams?.filter(team => team.status !== 0) || [];
  const myTeam = challenge?.joinTeams?.find(team => team.userJoin);

  const [submitForm, setSubmitForm] = useState({
    description: '',
    progress: 0,
    file: '',
  });
  const { isLogin } = useUserStore()
  const [revealForm, setRevealForm] = useState({
    teamName: '',
    description: '',
    plan: ''
  });

  const router = useRouter()
  const loadTeamRecords = async () => {
    if (!myTeam?.id) {
      return;
    }
    apiGetProjectRecords(myTeam.id).then(({ data }) => {
      setSubmitHistory(data || []);
    }).catch(() => {
      message.warning('获取项目进度失败');
    })
  }

  const handleUploadProgressFile = async (file: File) => {
    if (!file) {
      message.warning('请上传项目进度文件');
      return false;
    }
    const res = await fileUpload(file);
    setSubmitForm(prev => ({ ...prev, file: `${res}` }));
    return false; // 阻止 Upload 组件自动上传
  }

  const currentOrg = useGetOrg().getOrganizationById(challenge?.orgId!);
  const orgName = currentOrg?.name || '';
  const domainName = FIELD_MAP[challenge?.fieldType || 0];
  const typeName = TYPE_MAP[challenge?.type || 0];
  const publishDateStr = Utils.date.format(challenge?.createTime || 0, 'yyyy-MM-dd');
  const deadlineStr = Utils.date.format(challenge?.projectLastTime || 0, 'yyyy-MM-dd');
  const tagsList = challenge?.tags ? challenge.tags.split(',') : [];
  const reqList = challenge?.technicalIndicators ? challenge.technicalIndicators.split('\n') : [];
  const solverReqList = challenge?.personnelRequirements ? challenge.personnelRequirements.split('\n') : [];
  const isSingleTeam = challenge?.teamType === ChallengeTeamType.SINGLE_TEAM;

  const steps = [
    { id: 'published', label: statusFlow.published, status: ChallengeStatus.PUBLISHED },
    { id: 'claimed', label: statusFlow.claimed, status: ChallengeStatus.CLAIMED },
    { id: 'acceptance', label: statusFlow.acceptance, status: ChallengeStatus.IN_ACCEPTANCE },
    { id: 'finished', label: statusFlow.finished, status: ChallengeStatus.FINISHED },
  ];

  const getStepStatus = (stepStatus: number, currentStatus: number) => {
    // Statuses are 1-5 ordered
    if (stepStatus < currentStatus) return 'completed';
    if (stepStatus === currentStatus) return 'current';
    return 'upcoming';
  };

  const handleRevealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (challenge.status !== ChallengeStatus.CLAIMED) {
      message.warning('该榜题目前为不可揭榜状态，无法揭榜');
      return;
    }
    if (!revealForm.teamName || !revealForm.description || !revealForm.plan) {
      message.warning('请填写队伍名称、描述和计划');
      return;
    }
    apiJoinRaceProject({
      projectId: challenge.id,
      teamName: revealForm.teamName,
      description: revealForm.description,
      plan: revealForm.plan,
      status: isSingleTeam ? TeamStatus.HIDDEN : TeamStatus.WORKING,
    }).then((res) => {
      message.success(isSingleTeam ? `队伍 "${revealForm.teamName}" 已提交揭榜申请` : `队伍 "${revealForm.teamName}" 已创建并成功揭榜。`);
      setChallenge((prev) => {
        prev.isJoined = true;
        prev.joinTeams = [...(prev.joinTeams || []), { ...res.data, userJoin: true, }];
        return prev;
      });
      router.refresh();
      setShowRevealModal(false);
    }).catch(() => {
      message.error(`队伍 "${revealForm.teamName}" 揭榜失败，请联系管理员。`);
    });
  };

  const openJoinModal = (team: IProjectTeam) => {
    setSelectedTeamForJoin(team);
    setShowJoinModal(true);
  };

  const handleSubmitProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.description || !submitForm.file) {
      message.warning('请填写项目进度描述和上传项目进度文件');
      return;
    }
    // if (!challenge.isJoined) {
    //   message.warning('您未加入该榜题，无法提交项目进度');
    //   return;
    // }

    Modal.confirm({
      title: '确认提交项目进度',
      content: `您确定要提交项目进度吗？\n描述：${submitForm.description}\n文件：${submitForm.file}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // Logic to submit progress
        apiSubmitProjectRecord({
          teamId: challenge.joinTeams?.[0].id || 0,
          content: submitForm.description,
          file: submitForm.file,
          // progress: submitForm.progress,
        }).then(() => {
          message.success('项目进度提交成功');
          setShowSubmitModal(false);
          setSubmitForm({ description: '', progress: 0, file: '' });
          loadTeamRecords();
        });
      }
    })
  };

  const handleJoinSubmit = () => {
    if (!selectedTeamForJoin || !selectedTeamForJoin.id) {
      message.warning('请选择要加入的队伍');
      return;
    }
    if (!joinReason) {
      message.warning('请填写申请理由');
      return;
    }
    // Logic to submit join request
    apiApplyToJoinTeam({
      teamId: selectedTeamForJoin.id,
      applyContent: `组队申请：用户${useUserStore.getState().user?.name || ''}申请加入队伍 “${selectedTeamForJoin!.teamName}”，\n参与榜题 "${challenge?.name || ''}" 的揭榜攻关，\n申请理由为：“${joinReason}”`,
    }).then(() => {
      message.success(`申请加入队伍 "${selectedTeamForJoin!.teamName}" 已发送，等待队长审核。`);
      setShowJoinModal(false);
      setJoinReason('');
    }).catch(() => {
      message.error(`队伍 "${selectedTeamForJoin}" 加入榜题失败，请联系管理员。`);
    });
  };

  const handleShowRevealModal = () => {
    if (!isLogin) {
      Modal.confirm({
        title: '提示',
        content: '您需要先登录才能揭榜，是否前往登录页？',
        okText: '去登录',
        onOk: () => {
          router.push('/login?from=' + encodeURIComponent(window.location.pathname));
        },
        cancelText: '取消',
      });
      return;
    }
    if (challenge.status !== ChallengeStatus.CLAIMED) {
      message.warning('该榜题目前为不可揭榜状态，无法揭榜');
      return;
    }
    setShowRevealModal(true);
  };

  useEffect(() => {
    if (myTeam) {
      loadTeamRecords();
    }
  }, [myTeam]);

  if (!challenge) {
    return <div className="p-8 text-center">暂无符合条件的榜题</div>;
  }


  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/tasks" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回列表
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {domainName}
                </span>
                <span className="inline-flex items-center rounded bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  {typeName}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{challenge.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <Link href={`/${currentOrg?.loginName}`} className="flex items-center cursor-pointer"><Building2 className="w-4 h-4 mr-1.5" /> {orgName}</Link>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> {challenge.city}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {publishDateStr}</span>
              </div>
              <div className="flex gap-2 mt-5">
                {tagsList.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end  gap-3 mt-2 md:mt-0">
              {/* <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                <Share2 className="w-4 h-4 mr-2" /> 分享
              </button> */}
              {challenge.status === ChallengeStatus.CLAIMED && !challenge.isJoined && (
                <button
                  onClick={handleShowRevealModal}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Award className="w-4 h-4 mr-2" /> 立即揭榜
                </button>
              )}
              {/* 暂未开始 */}
              {
                challenge.status === ChallengeStatus.PUBLISHED && (
                  <button
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400"
                  >
                    暂未开始
                  </button>
                )
              }

              {challenge.isJoined && (
                <span className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 w-fit">
                  <CheckCircle className="w-4 h-4 mr-2" /> 已揭榜
                </span>
              )}
              {/* 提示说明 */}
              {
                isSingleTeam && <span className='text-sm text-slate-500'>该榜题为单队伍榜题，同时只有一个队伍可以攻关</span>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Workflow Stepper */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <nav aria-label="Progress">
                <ol role="list" className="overflow-hidden">
                  <li className="relative pb-2">
                    <div className="flex flex-row justify-between w-full">
                      {steps.map((step, stepIdx) => {
                        const status = getStepStatus(step.status, challenge.status || ChallengeStatus.PUBLISHED);
                        return (
                          <div key={step.id} className="relative flex flex-col items-center flex-1">
                            {/* Connector Line */}
                            {stepIdx !== 0 && (
                              <div className={`absolute top-4 right-[50%] w-full h-1 ${status === 'completed' || status === 'current' ? 'bg-blue-600' : 'bg-slate-200'
                                }`} style={{ zIndex: 0 }}></div>
                            )}

                            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                              {status === 'completed' ? (
                                <CheckCircle className="h-8 w-8 text-blue-600 bg-white" />
                              ) : status === 'current' ? (
                                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                                </span>
                              ) : (
                                <Circle className="h-8 w-8 text-slate-300 bg-white" />
                              )}
                            </span>
                            <span className={`mt-3 text-xs font-bold ${status === 'current' ? 'text-blue-600' : 'text-slate-500'}`}>
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Solvers List / Teams */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-base font-bold text-slate-900 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-600" />
                揭榜攻关团队 ({solvers.length})
                {
                  challenge.isJoined && myTeam && myTeam.status !== 1 && (
                    <span className="text-xs text-slate-500 ml-2 flex-1 text-end ">您的队伍当前状态为：<Tag color={TEAM_STATUS_OPTIONS.find(item => item.value === myTeam.status)?.color || 'gray'}>{TEAM_STATUS_OPTIONS.find(item => item.value === myTeam.status)?.label || '未知'}</Tag>,如有疑问请联系发榜方</span>
                  )
                }
              </div>

              {solvers.length > 0 ? (
                <div className="space-y-4">
                  {solvers.map(solver => (
                    <div key={solver.id} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 sm:gap-0">
                          {/* 队伍头像+名称 核心区（移动端优先展示） */}
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-sm flex items-center justify-center font-bold text-white mr-3">
                              {solver?.teamName?.charAt(0) || ''}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">{solver.teamName}</span>
                            </div>
                          </div>

                          {/* 队长+人数信息区：移动端换行，PC端横向 */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:ml-6 text-sm">
                            {/* 队长信息 */}
                            <div className="flex items-center text-slate-500">
                              <UserIcon className="w-4 h-4 mr-1" />
                              队长: <span className="text-sm font-medium text-slate-700 ml-1">{solver.userName}</span>
                            </div>
                            {/* 人数信息 */}
                            <div className="flex items-center text-slate-500">
                              <Users className="w-4 h-4 mr-1" />队员：
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                {solver?.teamUsers?.filter(user => user.role !== TeamUserRole.TEAM_LEADER).map(user => (
                                  <span key={user.teamUserId} className="text-sm font-medium text-slate-700">{user.userName}</span>
                                ))}
                                {solver?.teamUsers?.filter(user => user.role !== TeamUserRole.TEAM_LEADER).length === 0 && (
                                  <span className="text-sm font-medium text-slate-500">无</span>
                                )}
                              </div>

                            </div>
                            {/* 状态标签：移动端跟在信息后，PC端保持原间距 */}
                            <span className="ml-0 sm:ml-3 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                              {solver.statusText}
                            </span>
                          </div>

                          {/* 操作按钮区：移动端单独一行右对齐，PC端flex-1右对齐 */}
                          <div className="w-full sm:w-auto sm:flex-1 flex justify-end mt-2 sm:mt-0">
                            {isLogin && solver.userJoin ? (
                              <span className="ml-0 sm:ml-3 text-xs text-green-600 font-medium bg-green-100 px-5 py-2 rounded-full">
                                我的队伍
                              </span>
                            ) : challenge.isJoined ? null : (
                              <button
                                onClick={() => openJoinModal(solver)}
                                className="flex-shrink-0 inline-flex items-center justify-center px-3 py-1.5 sm:px-3 sm:py-1.5 px-4 py-2 border border-blue-600 text-xs font-medium rounded text-blue-600 hover:bg-blue-50"
                              >
                                <UserPlus className="w-3.5 h-3.5 mr-1.5" /> 申请加入
                              </button>
                            )}
                          </div>
                        </div>
                        {/* 项目进度/方案审核中 */}
                        <div className="flex items-center mt-4 text-sm text-slate-600">
                          <div className="w-20"> 项目进度：</div>
                          <Progress percent={solver.progress} status="active" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-lg">
                  暂无团队揭榜，快来成为第一个挑战者！
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
              {/* 去除tab的滚动条 */}
              <div className="border-b border-slate-200 overflow-x-auto  overflow-y-hidden hide-scrollbar-x">
                <nav className="-mb-px flex whitespace-nowrap px-4" aria-label="Tabs">
                  {[
                    { id: 'overview', label: '榜题详情' },
                    { id: 'requirements', label: '验收标准' },
                    { id: 'solver_req', label: '揭榜方要求' },
                    { id: 'materials', label: '相关资料' },
                    { id: 'payment_intro', label: '金额发放说明' },
                    ...(challenge.myProgress !== undefined ? [{ id: 'submission', label: '进度提交' }] : []),
                    ...(challenge.status === ChallengeStatus.FINISHED ? [{ id: 'results', label: '结果公示' }] : []),
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="prose prose-slate max-w-none">
                    {/* <h3 className="text-lg font-bold mb-4">项目背景与描述</h3> */}
                    <WangEditorView value={challenge.description || ''}></WangEditorView>
                    {/* <h3 className="text-lg font-bold mb-4">标签</h3> */}

                  </div>
                )}
                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-slate-900">验收标准</h3>
                    <ul className="space-y-4">
                      {reqList.map((req, idx) => (
                        <li key={idx} className="flex items-start bg-slate-50 p-4 rounded-lg">
                          <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs mr-3">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 font-medium whitespace-pre-wrap">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'solver_req' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-slate-900">揭榜方要求</h3>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                      <p className="text-amber-800 text-sm">申请单位/团队必须满足以下条件方可揭榜：</p>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                      {solverReqList.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'materials' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-slate-900">相关资料</h3>
                    {challenge.fileSource ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-red-500 mr-3" />
                            <span className="font-medium text-slate-700">{challenge.fileSource}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-4 h-4 mr-1" /> 下载
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">暂无公开资料。</p>
                    )}
                  </div>
                )}
                {
                  activeTab === 'payment_intro' && (
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-slate-900">金额发放说明</h3>
                      <p className="text-slate-700 leading-relaxed">
                        {challenge.paymentInstruction || "暂无支付介绍。"}
                      </p>
                    </div>
                  )
                }

                {activeTab === 'results' && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center">
                      <Award className="w-5 h-5 mr-2" /> 结果公示
                    </h3>
                    <p className="text-green-800 leading-relaxed">
                      {challenge.publicityResults || "项目已成功结题。"}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">基本信息</h3>
              <dl className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <dt className="text-sm text-slate-500 flex items-center"><Wallet className="w-4 h-4 mr-2" /> 榜额</dt>
                  <dd className="text-xl font-bold text-amber-600">¥{(challenge.amount || 0) / 10000}万</dd>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <dt className="text-sm text-slate-500 flex items-center"><Calendar className="w-4 h-4 mr-2" /> 截止日期</dt>
                  <dd className="text-sm font-medium text-slate-900">{deadlineStr}</dd>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <dt className="text-sm text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-2" /> 研发周期</dt>
                  <dd className="text-sm font-medium text-slate-900">{challenge.period}{challenge.periodType === 1 ? '个月' : '天'}</dd>
                </div>
                {/* <div>
                  <dt className="text-sm text-slate-500 mb-1">{t.detail.contact}</dt>
                  <dd className="text-sm font-medium text-slate-900 flex items-center break-all">
                    <Phone className="w-4 h-4 mr-2 text-slate-400" />
                    {challenge.contactWay}
                  </dd>
                </div> */}
              </dl>
            </div>
            {challenge.isJoined && (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-200 space-y-6 px-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">项目攻关中</h3>
                  <p className="text-slate-600">您正在参与此项目，请按时提交阶段性成果。</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 inline-block w-full max-w-md">
                  <div className="flex justify-between flex-col gap-2  items-center mb-4">
                    <span className="text-sm font-medium text-slate-700">当前阶段: <span className="text-blue-600">阶段一 - 方案验证</span></span>
                    <span className="text-sm text-slate-500">截止: {deadlineStr}</span>
                  </div>
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Upload className="w-5 h-5 mr-2" /> 提交阶段成果
                  </button>
                </div>
                {
                  // 提交记录列表
                  submitHistory.length > 0 && (
                    <SubmitHistory historys={submitHistory} />
                    // <ul className='space-y-2'>
                    //   <div className='text-sm font-medium text-slate-700 mb-2'>提交历史</div>
                    //   {submitHistory.map((item, index) => (
                    //     <li key={item.id} className="flex  flex-col items-start gap-2   py-2 border-b border-slate-100">
                    //       <span className="text-xs text-slate-700">{item.content}</span>
                    //       <span className="text-xs text-slate-500">{Utils.date.format(item.createTime)}</span>
                    //     </li>
                    //   ))}
                    // </ul>
                  )
                }
              </div>
            )}

            {/* Issuer Introduction */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                {t.detail.issuer_card.title}
              </h3>
              <h4 className="font-semibold text-slate-800 mb-2">{orgName}</h4>
              <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 rounded-lg p-3">
                <div>
                  <span className="block text-lg font-bold text-slate-900">12</span>
                  <span className="text-xs text-slate-500">{t.detail.issuer_card.stats_posted}</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900">8</span>
                  <span className="text-xs text-slate-500">{t.detail.issuer_card.stats_success}</span>
                </div>
              </div>
            </div> */}

            {/* <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
              <h4 className="font-bold text-lg mb-2">平台保障</h4>
              <p className="text-blue-100 text-sm mb-4">
                您的知识产权和资金安全由国家级托管服务保障。
              </p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors border border-white/40">
                阅读政策
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Submission Modal & Reveal Modal & Join Modal code remains mostly same, just ensuring correct state usage */}
      {/* ... (Existing modal code, omitted for brevity as logic doesn't depend heavily on data structure details here) ... */}
      {/* Reveal Modal */}
      {showRevealModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setShowRevealModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleRevealSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">填写揭榜信息</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">队伍名称</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={revealForm.teamName}
                        onChange={e => setRevealForm({ ...revealForm, teamName: e.target.value })}
                        placeholder="例如：北斗攻关小组"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">队伍简介</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={revealForm.description}
                        onChange={e => setRevealForm({ ...revealForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">技术方案</label>
                      <textarea
                        required
                        rows={3}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={revealForm.plan}
                        onChange={e => setRevealForm({ ...revealForm, plan: e.target.value })}
                        placeholder="简述攻关思路..."
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    确认揭榜
                  </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowRevealModal(false)}>
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {
        showSubmitModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setShowSubmitModal(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">提交进度</h3>
                  <p className="text-sm text-slate-500 mb-4">请上传您的项目进度，我们将在24小时内评估您的解题进度。</p>
                  {/* 描述 */}
                  <div className='mb-4'>
                    <label className="block text-sm font-medium text-slate-700 mb-1">项目进度描述</label>
                    <textarea
                      required
                      rows={3}
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={submitForm.description}
                      onChange={e => setSubmitForm({ ...submitForm, description: e.target.value })}
                      placeholder="描述您的项目进度..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">项目进度文件/链接</label>
                    <Flex vertical gap={10}>
                      <AntdUpload fileList={[]} beforeUpload={handleUploadProgressFile} showUploadList={false} >
                        <Button block className='w-full' size='large'><UploadOutlined /> 上传</Button>
                      </AntdUpload>
                      {submitForm.file && <a href={submitForm.file} target="_blank" className="text-sm text-blue-500">链接：{submitForm.file}</a>}
                      <Input
                        required
                        type="text"
                        className=" border border-slate-300 box-border rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        value={submitForm.file}
                        onChange={e => setSubmitForm({ ...submitForm, file: e.target.value })}
                        placeholder='请输入项目进度文件链接'
                      />
                    </Flex>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSubmitProgress}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    提交
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setShowJoinModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-slate-900 mb-2">申请加入队伍</h3>
                <p className="text-sm text-slate-500 mb-4">申请加入 <strong>{selectedTeamForJoin?.teamName}</strong></p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">申请说明</label>
                  <textarea
                    className="w-full border border-slate-300 rounded-md p-2 h-32 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={'请简述您的专业能力及想加入的原因...'}
                    value={joinReason}
                    onChange={(e) => setJoinReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleJoinSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  发送申请
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChallengeDetail;
