const api = require('../../utils/api');

// 四种技能的教学卡片内容
const SKILL_CONTENT = {
  logic: {
    name: '逻辑力',
    desc: '用清晰的结构和严密的推理，让观点无懈可击',
    cards: [
      {
        icon: '🧱',
        title: '核心概念',
        body: '逻辑表达就是用「论点 → 论据 → 推理 → 结论」的结构组织语言。好的逻辑表达让对方无法反驳——不是因为声音大，而是因为每一步都站得住脚。关键在于：先明确你的核心主张是什么，然后用事实和推理来支撑它。'
      },
      {
        icon: '🛠️',
        title: '实用技巧',
        body: '• MECE原则：分类要「相互独立、完全穷尽」，避免重叠和遗漏\n• 三段论：大前提 → 小前提 → 结论（如：诚信很重要 → 你失信了 → 我需要重新评估我们的合作）\n• 因果链：用「因为…所以…如果…那么…」串联逻辑\n• 先承认对方合理部分，再指出问题所在，对方更容易接受'
      },
      {
        icon: '⚠️',
        title: '常见误区',
        body: '• 循环论证："这个方案不行因为它不可行"（没说为什么不可行）\n• 偷换概念：把对方的观点曲解成另一个更容易攻击的观点\n• 以偏概全：用一个案例推导出普遍结论\n• 情绪化推进：用愤怒替代论证，气势赢了但逻辑输了'
      }
    ]
  },
  empathy: {
    name: '共情力',
    desc: '先走进对方的世界，再带对方看你的风景',
    cards: [
      {
        icon: '💛',
        title: '核心概念',
        body: '共情不是同意，而是理解。在表达不同意见之前，先让对方感受到"我听到了你，我理解你为什么这么想"。这会让对方的防御降低，更愿意听你说。真正的共情是把对方的情绪用语言映照回去，而不是简单说"我理解你"。'
      },
      {
        icon: '🛠️',
        title: '实用技巧',
        body: '• Feel-Felt-Found法："我理解你的感受（Feel），很多人一开始也有类似的想法（Felt），但后来他们发现…（Found）"\n• 镜像复述：用自己的话把对方说的内容复述一遍，确认你理解对了\n• 情绪命名："听起来这件事让你很失望"比"你别生气了"更有效\n• 先锚定共同目标："我们都希望这个项目成功…"'
      },
      {
        icon: '⚠️',
        title: '常见误区',
        body: '• 虚假共情："我理解你但是…"（"但是"否定了前面的共情）\n• 急于给建议：对方还没说完就开始提供解决方案\n• 否定感受："你想多了""这有什么好担心的"\n• 过度共情：沉浸在对方的情绪中，忘了表达自己的观点'
      }
    ]
  },
  rebuttal: {
    name: '反驳力',
    desc: '精准拆解对方逻辑，让对方自己发现漏洞',
    cards: [
      {
        icon: '⚔️',
        title: '核心概念',
        body: '反驳不是吵架，而是帮助对方看到自己论证中的盲区。好的反驳让对方说"你说的有道理"而不是"我不想跟你说话了"。核心原则：先理解对方的完整论证，再找到最薄弱的环节精准切入，而不是全面攻击。'
      },
      {
        icon: '🛠️',
        title: '实用技巧',
        body: '• 苏格拉底式提问：用一连串问题引导对方自己发现矛盾\n  例："你说A会导致B，那有没有其他因素也会导致B？"\n• 归谬法：把对方的逻辑推到极端来展示其荒谬\n• 区分事实与观点："你说的这个有数据支持吗？还是你的判断？"\n• 先承认再质疑："你这个角度看确实有道理，不过…"'
      },
      {
        icon: '⚠️',
        title: '常见误区',
        body: '• 情绪化反驳：被激怒后失去理性，开始人身攻击\n• 稻草人谬误：歪曲对方观点成更容易攻击的版本再反驳\n• 全面否定：认为对方全错（实际上对方可能有一部分是对的）\n• 纠缠细节：在无关紧要的细节上较劲，忽略了核心问题'
      }
    ]
  },
  humor: {
    name: '幽默力',
    desc: '用巧妙的意外连接化解紧张，让气氛从对立变成对话',
    cards: [
      {
        icon: '😄',
        title: '核心概念',
        body: '幽默不是讲笑话，而是用意外的视角重新框定问题。当气氛紧张时，一句恰到好处的幽默可以让双方从"对抗模式"切换到"一起面对问题"的模式。核心机制是"期待 vs 意外"——让对方以为你要说A，结果你说的是B，而这个B又出奇地贴切。'
      },
      {
        icon: '🛠️',
        title: '实用技巧',
        body: '• 自嘲：拿自己开刀最安全，也最让人放松戒备\n  例："你说得对，我在这方面确实是反面教材协会的荣誉会员"\n• 类比夸张：把一个严肃的问题和一个荒诞的类比联系起来\n• 预期反转：先让对方以为你要反驳，结果你用一个出乎意料的角度接住\n• 时机感：紧张达到顶点前用幽默降温，不要在对方情绪正激动时用'
      },
      {
        icon: '⚠️',
        title: '常见误区',
        body: '• 冒犯性玩笑：拿对方的身份、外表、能力开玩笑\n• 不合时宜：在严肃的场合或对方正在倾诉痛苦时强行幽默\n• 过度使用：每句话都想搞笑会让人觉得你不够认真\n• 用幽默逃避：用玩笑回避真正需要面对的问题'
      }
    ]
  }
};

Page({
  data: {
    skillKey: '',
    skillName: '',
    skillIcon: '',
    skillDesc: '',
    teachingCards: [],
    scenario: '',
    userAnswer: '',
    evaluating: false,
    result: null,
    scoreWord: ''
  },

  onLoad(options) {
    const key = options.key || 'logic';
    const name = decodeURIComponent(options.name || '逻辑力');
    const icon = decodeURIComponent(options.icon || '🧠');
    const content = SKILL_CONTENT[key] || SKILL_CONTENT.logic;

    wx.setNavigationBarTitle({ title: name + '练习' });

    this.setData({
      skillKey: key,
      skillName: name,
      skillIcon: icon,
      skillDesc: content.desc,
      teachingCards: content.cards.map(card => ({
        ...card,
        lines: card.body.split('\n')
      }))
    });
  },

  onScenarioInput(e) {
    this.setData({ scenario: e.detail.value });
  },

  onUserAnswerInput(e) {
    this.setData({ userAnswer: e.detail.value });
  },

  async onSubmit() {
    const { scenario, userAnswer, skillKey, skillName } = this.data;

    if (!scenario.trim()) {
      wx.showToast({ title: '请先描述练习场景', icon: 'none' });
      return;
    }
    if (!userAnswer.trim()) {
      wx.showToast({ title: '请写下你打算怎么表达', icon: 'none' });
      return;
    }

    this.setData({ evaluating: true, result: null });

    try {
      const result = await api.practiceSkill({
        skill: skillKey,
        skillName,
        scenario: scenario.trim(),
        userAnswer: userAnswer.trim()
      });

      const score = result.score || 5;
      let scoreWord = '';
      if (score >= 9) scoreWord = '太棒了！🏆';
      else if (score >= 7) scoreWord = '很不错！👏';
      else if (score >= 5) scoreWord = '继续加油 💪';
      else scoreWord = '还有进步空间 🌱';

      this.setData({
        result,
        scoreWord,
        evaluating: false
      });
    } catch (err) {
      wx.showToast({ title: err.error || '评估失败，请重试', icon: 'none' });
      this.setData({ evaluating: false });
    }
  }
});
