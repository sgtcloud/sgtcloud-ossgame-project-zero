/**
 * Created by highkay on 2015/12/29.
 */
var Skill = cc.Class.extend({
    ctor: function (id, lv, heroId) {
        this._id = id;
        this._lv = lv;
        this._data = dataSource.skills[id];
        this._icon = this._data.icon;
        this._type = this._data.type;
        this._heroId = heroId;
    }
    ,
    getIcon: function () {
        return this._icon;
    },
    getType: function () {
        return this._type;
    },
    getUnlockLevel: function () {
        return getLevelData(this._data, 'unlockLevel', this.getLv());
    },
    isLocked: function () {
        return this.getLv() < this.getUnlockLevel()
    },
    getId: function () {
        return this._id;
    },
    /**
     * 获取升下一级所需数据
     * @returns {*}
     */
    getNextLevelUpgrade: function () {
        var level = this.getLv();
        var cost = getLevelData(this._data, 'upgrade', level + 1);
        return cost;
    },
    getLevelData: function (level) {
        return getSpecificLevelData(this._data, level || this.getLv());
    },
    /**
     * 是否最高级别
     * @returns {boolean} true 是，false 不是
     */
    isMaxLevel: function () {
        return this.getLv() >= this.getMaxLevel();
    },
    getMaxLevel: function () {
        return this._data.levelDatas[this._data.levelDatas.length - 1]['level'];
    },
    upgrade: function () {
        this._lv++;
        for (var i in player.heroes) {
            var cacheHero = player.heroes[i];
            if (cacheHero.id === this._heroId) {
                cacheHero['skills'] = cacheHero['skills'] || {};
                if (cacheHero['skills'] instanceof Array) {
                    cacheHero['skills'] = {};
                }
                cacheHero['skills'][this.getId()] = cacheHero['skills'][this.getId()] || {};
                cacheHero['skills'][this.getId()]['level'] = this._lv;
                break;
            }
        }

    },
    /**
     * 获取当前级别
     * @returns {int}
     */
    getLv: function () {
        return this._lv;
    },
    getName: function () {
        return this._data.name;
    },
    getDesc: function () {
        return this._data.desc;
    },
    getBuffDesc: function () {
        return this._data.buffDesc;
    },
    getPreShow: function () {
        return this._data.preShow;
    },
    getEffect: function (key) {
        return getEffectValue(this._data, key, this._lv);
    },
    isUseable: function () {
        return this._data.useable;
    },
    getEffectRes: function () {
        return this._data.effectRes;
    },
    getEffectTarget: function () {
        return this._data.effectTarget;
    },
    getEffectType: function () {
        return this._data.effectType;
    },
    getAffectDelay: function () {
        return this._data.affectDelay;
    },
    /**
     * 遍历制定级别的所有技能效果,按index正序排列
     * @param lv 级别，默认为当前级别
     * @returns [{type:'技能type','value':111,'index':'排列位置'}]
     */
    traverseSkillEffects: function (lv) {
        lv = lv || this.getLv();
        var levelData = this.getLevelData(lv);
        var effects = [];
        for (var key in levelData) {
            //狗日的微信浏览器中没有startsWith
            if (key.indexOf("effect") == 0) {
                var effect = $$.extend(levelData[key], {'name': key, 'index': parseInt(key.replace("effect", ""))});
                if (lv === 0) {
                    effect['value'] = 0;
                }
                effects.push(effect);
            }
        }
        return effects.sort(function (a, b) {
            return a.index - b.index;
        });
    }
});