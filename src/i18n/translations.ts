
export const STATUS_MAP_CN: Record<number, string> = {
    1: '已发布',
    2: '待揭榜',
    3: '攻关中',
    4: '验收中',
    5: '已结束'
};

export const translations = {
  zh: {
    nav: {
      brand: 'OpenRace',
      home: '首页',
      challenges: '榜题中心',
      experts: '揭榜人才',
      dashboard: '发榜管理',
      profile: '个人中心',
      login: '登录',
      logout: '退出'
    },
    home: {
      hero_title: '汇聚全球创新力量\n攻克国家关键核心技术',
      hero_subtitle: '',
      hero_desc: '英雄不论出处，谁有本事谁揭榜——聚焦“卡脖子”技术，打通从“科研”到“产业”的最后一公里，加速科技自立自强',
      find_challenges: '寻找榜题',
      post_req: '发布需求',
      stats_published: '发榜数量',
      stats_fund: '发榜金额',
      stats_claims: '揭榜数量',
      stats_experts: '揭榜人才',
      stats_partners: '合作单位',
      why_title: '为什么选择 OpenRace?',
      why_desc: '值得信赖的技术成果转化加速平台',
      why_features: {
        1: { title: '权威榜题来源', desc: '聚焦国家重大战略需求，榜题均经院士专家论证，覆盖12大关键技术领域，确保技术方向的前瞻性与必要性。' },
        2: { title: '全流程透明监督', desc: '从揭榜到结题，实时公示进度、中期评估结果及评审过程，杜绝暗箱操作，确保攻关质量与公平公正。' },
        3: { title: '政企资源支持', desc: '联合70+科研院所、300+龙头企业，提供实验平台、数据集、技术指导等资源，降低攻关门槛。' },
        4: { title: '成果优先转化', desc: '“擂主”成果优先对接央企/地方政府项目，提供专利布局、市场化推广服务，加速技术落地。' },
      },
      guide_title: '快速参与指南',
      guide_issuer: '我是发榜方',
      guide_solver: '我是揭榜方',
      guide_steps_issuer: [
          { title: '注册认证', desc: '完成企业/机构资质认证' },
          { title: '发布需求', desc: '填写技术指标与赏金' },
          { title: '专家论证', desc: '平台专家审核需求合理性' },
          { title: '选定揭榜方', desc: '评估揭榜方案并签约' },
          { title: '项目验收', desc: '阶段性考核与最终交付' }
      ],
      guide_steps_solver: [
          { title: '注册认证', desc: '实名认证与能力评估' },
          { title: '筛选榜题', desc: '查找匹配的技术难题' },
          { title: '提交方案', desc: '编写技术路线与计划' },
          { title: '签署协议', desc: '确立权责与资金安排' },
          { title: '提交成果', desc: '按里程碑交付研发成果' }
      ],
      charts_title: '平台运营数据',
      chart_domain: '热门技术领域分布',
      chart_status: '榜题状态分布',
      hot_challenges: '热门榜题',
      view_all: '查看全部',
      latest_news: '最新动态'
    },
    experts: {
        title: '揭榜人才库',
        subtitle: '汇聚全球顶尖科研大脑，寻找你的最强战友',
        search_placeholder: '搜索专家姓名、研究方向...',
        view_profile: '查看详情',
        detail: {
            back: '返回人才库',
            intro: '个人简介',
            resume: '履历背景',
            research: '研究方向',
            honors: '个人荣誉',
            achievements: '技术成果',
            projects: '揭榜列表',
            join_team: '申请加入',
            team_leader_of: '所在团队',
            send_request: '发送申请',
            request_sent: '申请已发送',
        }
    },
    center: {
      title: '榜题中心',
      subtitle: '汇聚国家级科研难题，寻找顶尖攻关团队',
      search_placeholder: '请输入榜题名称、发榜单位或关键词...',
      filters: {
        category: '榜题类型', // Updated
        domain: '技术方向',
        status: '榜题状态',
        amount: '榜题金额',
        region: '所在区域'
      },
      all: '全部',
      sort_default: '默认排序',
      sort_newest: '最新发布',
      sort_amount: '金额最高',
      total_found: '共找到 {count} 个相关榜题',
      no_results: '暂无符合条件的榜题'
    },
    detail: {
      back: '返回列表',
      basic_info: '基本信息',
      fund: '榜额',
      deadline: '截止日期',
      duration: '研发周期',
      issuer: '发榜单位',
      region: '区域',
      contact: '联系方式',
      publish_date: '发布时间',
      tabs: {
        overview: '榜题详情',
        requirements: '验收标准',
        solver_req: '揭榜方要求',
        materials: '相关资料',
        submission: '进度提交',
        results: '结果公示'
      },
      claim_btn: '立即揭榜',
      claimed_msg: '您已成功揭榜该项目，请按时提交进度。',
      submit_phase_btn: '提交阶段成果',
      download: '下载',
      login_to_view: '登录后查看更多',
      status_flow: {
        published: '已发布',
        waiting: '等待揭榜',
        claimed: '揭榜攻关中',
        acceptance: '验收中',
        finished: '已结束'
      },
      issuer_card: {
        title: '发榜单位介绍',
        stats_posted: '累计发榜',
        stats_success: '成功转化'
      },
      competition_card: {
          title: '揭榜攻关团队',
          total_solvers: '揭榜团队',
          progress: '进度',
          join_btn: '申请加入'
      },
      reveal_modal: {
          title: '填写揭榜信息',
          team_name: '组建队伍名称',
          team_desc: '队伍简介',
          plan: '初步技术方案',
          confirm: '确认揭榜',
          cancel: '取消'
      },
      join_modal: {
          title: '申请加入团队',
          reason: '申请说明',
          reason_placeholder: '请简述您的专业能力及想加入的原因...',
          confirm: '发送申请',
          cancel: '取消'
      }
    },
    profile: {
      title: '个人中心',
      tabs: {
        tasks: '我的揭榜任务',
        team: '我的团队',
        history: '历史记录',
        messages: '消息通知'
      },
      teams: {
        created: '我创建的团队',
        joined: '我加入的团队',
        members_count: '成员: {count}人',
        view_detail: '查看详情',
        challenge_link: '关联榜题',
        detail_modal: {
            title: '团队详情',
            members: '团队成员',
            progress: '当前项目进度',
            history: '提交历史',
            role_leader: '队长',
            role_member: '队员'
        }
      },
      team_name: '团队名称',
      leader: '负责人',
      members: '团队成员',
      add_member: '添加成员',
      no_team: '您尚未加入任何团队',
      role: '角色',
      specialty: '专长',
      task_status: '任务状态',
      progress: '当前进度',
      submit_progress: '提交进度',
      progress_modal_title: '提交阶段成果',
      submit: '提交',
      cancel: '取消',
      no_tasks: '暂无进行中的任务',
      messages: {
          no_messages: '暂无消息',
          apply_join: '申请加入团队',
          view_detail: '查看申请',
          approve: '同意',
          reject: '拒绝'
      }
    },
    dashboard: {
        title: '发榜管理',
        create_btn: '发布新榜题',
        form: {
            title: '榜题名称',
            domain: '领域',
            org: '发榜单位',
            contact: '联系方式',
            desc: '详细描述'
        }
    },
    status: {
      1: '已发布',
      2: '待揭榜',
      3: '攻关中',
      4: '验收中',
      5: '已结束'
    }
  }
};
