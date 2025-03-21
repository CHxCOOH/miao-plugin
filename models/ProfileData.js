import lodash from 'lodash'
import Base from './Base.js'
import moment from 'moment'
import { Data, Cfg } from '../components/index.js'
import { Character, ProfileArtis, ProfileDmg } from './index.js'
import AttrCalc from './profile-lib/AttrCalc.js'

export default class ProfileData extends Base {
  constructor (ds = {}, uid, attrCalc = true) {
    super()
    let char = Character.get({ id: ds.id, elem: ds.elem })
    if (!char) {
      return false
    }
    this.id = char.id
    this.char = char
    this.uid = uid || ''
    this.setBasic(ds)
    ds.attr && this.setAttr(ds.attr)
    ds.weapon && this.setWeapon(ds.weapon)
    ds.talent && this.setTalent(ds.talent)
    this.artis = new ProfileArtis(this.id, this.elem)
    ds.artis && this.setArtis(ds.artis)
    if (attrCalc && Cfg.get('attrCalc') && this.hasData) {
      this.calcAttr()
    }
  }

  static create (ds, uid) {
    let profile = new ProfileData(ds, uid)
    if (!profile) {
      return false
    }
    return profile
  }

  calcAttr () {
    this._attr = AttrCalc.create(this)
    this.attr = this._attr.calc()
    this._attrCalc = true
  }

  setBasic (ds = {}) {
    this.level = ds.lv || ds.level || 1
    this.cons = ds.cons || 0
    this.fetter = ds.fetter || 0
    this._costume = ds.costume || 0
    this.elem = ds.elem || this.char.elem || ''
    this.dataSource = ds.dataSource || 'enka'
    this.promote = lodash.isUndefined(ds.promote) ? AttrCalc.calcPromote(this.level) : (ds.promote || 0)
    this._time = ds._time || ds.updateTime || new Date() * 1
  }

  setAttr (ds) {
    this.attr = lodash.extend(Data.getData(ds, 'atk,atkBase,def,defBase,hp,hpBase,mastery,recharge'), {
      heal: ds.heal || ds.hInc || 0,
      cpct: ds.cpct || ds.cRate,
      cdmg: ds.cdmg || ds.cDmg,
      dmg: ds.dmg || ds.dmgBonus || 0,
      phy: ds.phy || ds.phyBonus || 0
    })
  }

  setWeapon (ds = {}) {
    this.weapon = {
      name: ds.name,
      star: ds.rank || ds.star || 1,
      level: ds.level || ds.lv || 1,
      promote: lodash.isUndefined(ds.promote) ? AttrCalc.calcPromote(ds.level || ds.lv || 1) : (ds.promote || 0),
      affix: ds.affix
    }
    let w = this.weapon
    if (w.level < 20) {
      w.promote = 0
    }
  }

  setArtis (ds = false) {
    this.artis.setProfile(this, ds)
  }

  setTalent (ds = {}, mode = 'original') {
    this.talent = this.char.getAvatarTalent(ds, this.cons, mode)
  }

  get name () {
    return this.char?.name || ''
  }

  // 判断当前profileData是否具有有效数据
  get hasData () {
    // 检查数据源
    if (!this.dataSource || !['enka', 'change', 'miao'].includes(this.dataSource)) {
      return false
    }
    // 检查属性
    if (!this.weapon || !this.talent || !this.artis) {
      return false
    }
    // 检查旅行者
    if (['空', '荧'].includes(this.name)) {
      return !!this.elem
    }
    return true
  }

  // 判断当前profileData是否具备有效圣遗物信息
  hasArtis () {
    return this.hasData && this.artis.length > 0
  }

  get costume () {
    let costume = this._costume
    if (lodash.isArray(costume)) {
      costume = costume[0]
    }
    let talent = this.talent ? lodash.map(this.talent, (ds) => ds.original).join('') : ''
    if (this.cons === 6 || ['ACE', 'ACE²'].includes(this.artis?.markClass) || talent === '101010') {
      return [costume, 'super']
    }
    return [costume, 'normal']
  }

  get originalTalent () {
    return lodash.mapValues(this.talent, (ds) => ds.original)
  }

  // toJSON 供保存使用
  toJSON () {
    let ret = {
      ...this.getData('id,name,elem,level,promote,fetter,costume,cons,talent,attr,weapon,artis,dataSource,_time')
    }
    ret.talent = lodash.mapValues(this.talent, (ds) => ds.original)
    ret.costume = this.costume[0] || 0
    return ret
  }

  get updateTime () {
    let time = this._time
    if (!time) {
      return ''
    }
    if (lodash.isString(time)) {
      return moment(time).format('MM-DD HH:mm')
    }
    if (lodash.isNumber(time)) {
      return moment(new Date(time)).format('MM-DD HH:mm')
    }
    return ''
  }

  get dataSourceName () {
    return {
      enka: 'Enka.Network',
      miao: '喵喵Api',
      input: 'Input'
    }[this.dataSource] || 'Enka.NetWork'
  }

  get isProfile () {
    return true
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    if (this.hasData) {
      return this.artis.getMarkDetail(withDetail)
    }
    return {}
  }

  get hasDmg () {
    return this.hasData && !!ProfileDmg.dmgRulePath(this.name)
  }

  // 计算当前profileData的伤害信息
  async calcDmg ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.dmg) {
      let ds = this.getData('id,level,attr,cons,artis:artis.sets')
      ds.talent = lodash.mapValues(this.talent, 'level')
      ds.weapon = Data.getData(this.weapon, 'name,affix')
      this.dmg = new ProfileDmg(ds)
    }
    return await this.dmg.calcData({ enemyLv, mode, dmgIdx })
  }
}
