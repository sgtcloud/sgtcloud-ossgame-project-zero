var Hero = cc.Class.extend({
        ctor: function (heroData) {
            this.init(heroData);
            customEventHelper.bindListener(EVENT.HERO_DIE, function (data) {
                var hero = data.getUserData();
                if (hero.getId() === this._id) {
                    PlayerData.updateHeroDeadTime(this._id);
                }
            }.bind(this));
            customEventHelper.bindListener(EVENT.HERO_REVIVE, function (data) {
                var hero = data.getUserData();
                if (hero.getId() === this.getId()) {
                    PlayerData.clearHeroDeadTime(this.getId());
                }
            }.bind(this));
            this.refreshProps();

        },
        init: function (heroData) {
            this._id = heroData.id;
            this._lv = heroData.lv;
            this._star = heroData.star;
            this._data = dataSource.heros[this._id];
            this._equips = [];
            this._skills = [];
            this._icon = this._data.icon;
            this._heroData = heroData;
            for (var i in this._data.equips) {
                var equipId = this._data.equips[i];
                var equipCache = this._readEquipCache(equipId);
                this._equips.push(new Equip(equipId, equipCache));
            }

            for (var i in this._data.skills) {
                var skillId = this._data.skills[i];
                var skill = this._readCache(skillId);
                var skillLv = (skill && skill['level']) || 0;
                this._skills.push(new Skill(skillId, skillLv, this._id));
            }
        },
        calcProp: function (propName, lvData) {
            var val = 0;
            var tmpVal = 0;
            var rate = 1.0;
            tmpVal = lvData || getLevelData(this._data, propName, this.getLv());
            if (tmpVal) {
                val += tmpVal;
            }
            tmpVal = this[propName + "_value"];
            if (tmpVal) {
                val += tmpVal;
            }
            tmpVal = PlayerData["globe_" + propName + "_value"];
            if (tmpVal) {
                val += tmpVal;
            }
            tmpVal = this[propName + "_rate"];
            if (tmpVal) {
                rate += tmpVal / 100;
            }
            tmpVal = PlayerData["globe_" + propName + "_rate"];
            if (tmpVal) {
                rate += tmpVal / 100;
            }
            tmpVal = PlayerData["buff_" + propName + "_rate"];
            if (tmpVal) {
                rate += tmpVal / 100;
            }
            if (propName === "atk_period") {
                return val / rate;
            } else {
                return val * rate;
            }
        }, _readCache: function (skillId) {
            return this._heroData.skills[skillId]
        }, _readEquipCache: function (id) {
            return this._heroData.equips[id]
        }, getIcon: function () {
            return this._icon;
        }
        , getCurrentLife: function () {
            return this._heroData.life;
        }, changeLife: function (val) {
            this._heroData.life += val;
            if (this._heroData.life < 0) {
                this._heroData.life = 0;
            }
            var maxLife = this.getLife();
            if (this._heroData.life >= maxLife) {
                this._heroData.life = maxLife;
            }
        }, getMaxLevel: function () {
            return this._data.levelDatas[this._data.levelDatas.length - 1]['level'];
        }, refreshProps: function () {
            for (var i in effect_props) {
                this[effect_props[i] + "_value"] = 0;
                this[effect_props[i] + "_rate"] = 0;
                this["globe_" + effect_props[i] + "_value"] = 0;
                this["globe_" + effect_props[i] + "_rate"] = 0;
                this.calcSkillEffect(effect_props[i]);
                this.calcEquipEffect(effect_props[i]);
            }
            this.printHeroProps();
        }, isDead: function () {
            var dieTime = PlayerData.getHeroDeadTime(this.getId());
            return typeof dieTime !== 'undefined' || !this.getCurrentLife() > 0;
        }, hasSkill: function (skillId) {
            for (var i in this._skills) {
                if (this._skills[i].getId() === skillId) {
                    return true;
                }
            }
            return false;
        }, _validateLocked: function (unlock) {
            if (unlock) {
                var unit = unlock['unit'];
                var value = unlock['value'];
                switch (unit) {
                    case 'hero':
                        var hero = PlayerData.getHeroById(value);
                        return hero.getLv() < 1;
                    default:
                }
            }
            return false;
        }, isLocked: function () {
            var unlock = this._data['unlock'];
            return this._validateLocked(unlock);
        }
        ,
        isMaxLevel: function () {
            return this._lv >= this.getMaxLevel();
        }
        ,
        getUnLock: function () {
            return this._data['unlock']
        }
        ,
        getNextLevelUpgrade: function () {
            var level = this.getLv();
            var cost = getLevelData(this._data, 'upgrade', level + 1);
            return cost;
        },
        getLevelUpgrade: function (lv) {
            return getLevelData(this._data, 'upgrade', lv);
        }
        ,
        getLevelData: function (level) {
            return getSpecificLevelData(this._data, level || this._lv);
        }
        ,
        getResurge: function () {
            return getLevelData(this._data, 'resurge', this.getLv())
        }
        ,
        getId: function () {
            return this._id;
        }
        ,
        getFile: function () {
            return this._data.file;
        }
        ,
        getLv: function () {
            return this._lv;
        }
        ,
        getName: function () {
            return this._data.name;
        }
        ,
        getStar: function () {
            return this._star;
        }
        ,
        getDesc: function () {
            return this._data.desc;
        }
        ,
        getEquipCount: function () {
            return this._equips.length;
        }
        ,
        getEquipData: function (i) {
            return this._equips[i];
        }
        ,
        getEquips: function () {
            return this._equips;
        }
        ,
        getSkillCount: function () {
            return this._skills.length;
        }
        ,
        getSkillData: function (i) {
            return this._skills[i];
        }
        ,
        getSkills: function () {
            return this._skills;
        }
        ,
        calcArrayEffect: function (effects, propName) {
            for (var j in effects) {
                if (effects[j].type === propName + "_value") {
                    this[propName + "_value"] += effects[j].value;
                }
                else if (effects[j].type === propName + "_rate") {
                    this[propName + "_rate"] += effects[j].value;
                }
                else if (effects[j].type === "globe_" + propName + "_value") {
                    this["globe_" + propName + "_value"] += effects[j].value;
                }
                else if (effects[j].type === "globe_" + propName + "_rate") {
                    this["globe_" + propName + "_rate"] += effects[j].value;
                }
            }
        }
        ,
        calcSkillEffect: function (propName) {
            for (var i in this._skills) {
                this.calcArrayEffect(this._skills[i].traverseSkillEffects(), propName);
            }
        }
        ,
        calcEquipEffect: function (propName) {
            for (var i in this._equips) {
                this.calcArrayEffect(this._equips[i].traverseEquipEffects(), propName);
            }
        }
        ,
        getLife: function () {
            if (this.isLocked()) {
                return 0;
            }
            return this.calcProp("life");
        }
        ,
        getAttack: function () {
            if (this.isLocked()) {
                return 0;
            }
            return this.calcProp("attack");
        }
        ,
        getHit: function () {
            if (this.isLocked()) {
                return 0;
            }
            return this.calcProp("tap");
        }
        ,
        getRecover: function () {
            var val = this._data.levelDatas[this._lv].resurge.time;
            return val;
        }
        ,
        getCtrChance: function () {
            if (this.isLocked()) {
                return 0;
            }
            // 暴击概率需要除以100来进行逻辑计算
            return this.calcProp("ctr_chance") / 100;
        },
        getCtrModify: function () {
            if (this.isLocked()) {
                return 0;
            }
            // 暴击倍率需要除以100来进行逻辑计算
            return this.calcProp("ctr_modify") / 100;
        }
        ,
        getAnimateDelay: function () {
            if (this.isLocked()) {
                return 0;
            }
            return this.calcProp("atk_period");
        }
        ,
        doUnlock: function () {
            if (this._lv > 0) {
                return false;
            }
            return true;
        },
        printHeroProps: function () {
            cc.log("==================================");
            cc.log("id=" + this._id);
            cc.log("atk_period=" + this.getAnimateDelay());
            cc.log("life=" + this.getLife());
            cc.log("atk=" + this.getAttack());
            cc.log("tap=" + this.getHit());
            cc.log("ctr_chance=" + this.getCtrChance());
            cc.log("ctr_modify=" + this.getCtrModify());
            cc.log("==================================");
        }
        ,
        /**
         * 英雄升级
         */
        upgrade: function (num) {
            num = num || 1;
            this._lv = this._lv + num;
            for (var i = 0; i < player.heroes.length; i++) {
                if (player.heroes[i]["id"] === this.getId()) {
                    player.heroes[i]['lv'] = this.getLv();
                    if (this._lv === 1) {
                        player.heroes[i].life = this.getLife();
                    }
                    break;
                }
            }
        }
    }
);
