export const details = [{
  title: '雷九八万满愿力Q首刀',
  params: {
    type: 0,
    num: 60,
    ban: 0
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '雷九万班满愿力Q首刀',
  params: {
    type: 0,
    num: 60,
    ban: 1
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '雷九万班满愿力重击',
  params: {
    type: 1,
    num: 60,
    ban: 1
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['重击伤害'], 'q')
}]

export const defParams = {
  ban: 1,
  num: 60,
  type: 0
}

export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg,recharge,mastery'

export const buffs = [
  {
    title: '恶曜开眼：开E元素爆发伤害提升[qDmg]%',
    data: {
      qDmg: ({ talent }) => talent.e['元素爆发伤害提高'] * 90
    }
  }, {
    title: '梦想真说：Q满愿力获得[qPct]%大招倍率加成',
    data: {
      qPct: ({ talent, params }) => talent.q['愿力加成'][params.type || 0] * params.num
    }
  }, {
    check: ({ cons }) => cons >= 2,
    title: '雷神2命：大招无视敌人[qIgnore]%防御力',
    data: {
      qIgnore: 60
    }
  }, {
    title: '雷神被动：基于元素充能获得[dmg]%雷伤加成',
    data: {
      dmg: ({ attr }) => Math.max(attr.recharge.base + attr.recharge.plus - 100, 0) * 0.4
    }
  }, {
    title: '风鹰宗室班：增加[atkPlus]点攻击力与[atkPct]%攻击力',
    data: {
      atkPct: ({ params }) =>20 * params.ban,
      atkPlus: ({ params }) =>1202.35 * params.ban
  }
  }, {
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      dmg: 40,
      atkPct:20,
      kx:40
   }
  }, {
    title: '天空九条：增加[atkPlus]点攻击力与[cdmg]%爆伤',
    data: {
      atkPlus: 794.2,
      cdmg:60,
   }
  }
      ]
