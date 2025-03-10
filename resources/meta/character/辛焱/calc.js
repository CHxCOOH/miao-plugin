export const details = [{
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['挥舞伤害'], 'e')
}, {
  title: '三级护盾量',
  dmg: ({ talent, calc, attr }, { shield }) =>
    shield(talent.e['三级护盾吸收量2'][0] * calc(attr.def) / 100 + talent.e['三级护盾吸收量2'][1] * 1)
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q', 'phy')
}, {
  title: '重击循环伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击循环伤害'], 'a2', 'phy')
}]

export const mainAttr = 'atk,def,cpct,cdmg'
export const enemyName = '魔偶/女士/雷神/丘丘'

export const buffs = [{
  title: '辛焱被动：处于护盾下物理伤害提高15%',
  data: {
    phy: 15
  }
}, {
  title: '辛焱2命：Q的暴击率提升100%',
  cons: 2,
  data: {
    qCpct: 100
  }
}, {
  title: '辛焱4命：E造成伤害使敌人物理抗性降低15%',
  cons: 4,
  data: {
    phyKx: 15
  }
}]
