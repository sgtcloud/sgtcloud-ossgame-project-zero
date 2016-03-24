var Hero = function (heroData) {
    this._id = heroData.id;
    this._lv = heroData.lv;
    var star = heroData.star;
    this._data = dataSource.heros[this._id];
    var equips = [];
    var skills = [];
    var icon = this._data.icon;
    for (var i in this._data.equips) {
        var equipId = this._data.equips[i];
        var equipCache = readEquipCache(equipId);
        equips.push(new Equip(equipId, equipCache));
    }
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
    for (var i in this._data.skills) {
        var skillId = this._data.skills[i];
        var skill = readCache(skillId);
        var skillLv = (skill && skill['level']) || 0;
        skills.push(new Skill(skillId, skillLv, this._id));
    }
    function readCache(skillId) {
        return heroData.skills[skillId]
    }

    function readEquipCache(id) {
        return heroData.equips[id]
    }

    this.getIcon = function () {
        return icon;
    }

    this.getCurrentLife = function () {
        return heroData.life;
    };
    this.changeLife = function (val) {
        heroData.life += val;
        if (heroData.life < 0) {
            heroData.life = 0;
        }
        var maxLife = this.getLife();
        if (heroData.life >= maxLife) {
            heroData.life = maxLife;
        }
    }
    this.getMaxLevel = function () {
        return this._data.levelDatas[this._data.levelDatas.length - 1]['level'];
    }

    this.refreshProps = function () {
        for (var i in effect_props) {
            this[effect_props[i] + "_value"] = 0;
            this[effect_props[i] + "_rate"] = 0;
            this["globe_" + effect_props[i] + "_value"] = 0;
            this["globe_" + effect_props[i] + "_rate"] = 0;
            this.calcSkillEffect(effect_props[i]);
            this.calcEquipEffect(effect_props[i]);
        }
        //this.printHeroProps();
    };
    this.isDead = function () {
        var dieTime = PlayerData.getHeroDeadTime(this.getId());
        return typeof dieTime !== 'undefined' || !this.getCurrentLife() > 0;
    };
    this.hasSkill = function (skillId) {
        for (var i in skills) {
            if (skills[i].getId() === skillId) {
                return true;
            }
        }
        return false;
    }
    var validateLocked = function (unlock) {
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
    }
    this.isLocked = function () {
        var unlock = this._data['unlock'];
        return  validateLocked(unlock);
        /*if( lv < 1){
         return true;
         };*/
        //console.log(this.getId()+" has been locked : "+locked)
    };
    this.isMaxLevel = function () {
        return this._lv >= this.getMaxLevel();
    }

    this.getUnLock = function () {
        return this._data['unlock']
    }

    this.getNextLevelUpgrade = function () {
        var level = this.getLv();
        var cost = getLevelData(this._data, 'upgrade', level + 1);
        return cost;
    };

    this.getLevelData = function (level) {
        return getSpecificLevelData(this._data, level || this._lv);
    }

    this.getResurge = function () {
        return getLevelData(this._data, 'resurge', this.getLv())
    }

    this.getId = function () {
        return this._id;
    };
    this.getFile = function () {
        return this._data.file;
    };
    this.getLv = function () {
        return this._lv;
    };
    this.getName = function () {
        return this._data.name;
    };
    this.getStar = function () {
        return star;
    };
    this.getDesc = function () {
        return this._data.desc;
    };

    this.getEquipCount = function () {
        return equips.length;
    };
    this.getEquipData = function (i) {
        return equips[i];
    };
    this.getEquips = function () {
        return equips;
    }
    this.getSkillCount = function () {
        return skills.length;
    };
    this.getSkillData = function (i) {
        return skills[i];
    };
    this.getSkills = function () {
        return skills;
    }
    this.calcArrayEffect = function (effects, propName) {
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
            /*if (!effects[j].type)continue;
             if (this[effects[j].type] != null && this[effects[j].type] != undefined) {
             this[effects[j].type] += effects[j].value;
             }
             else {
             this[effects[j].type] = effects[j].value;
             }*/
        }
    };
    this.calcSkillEffect = function (propName) {
        for (var i in skills) {
            this.calcArrayEffect(skills[i].traverseSkillEffects(), propName);
        }
    }
    this.calcEquipEffect = function (propName) {
        for (var i in equips) {
            this.calcArrayEffect(equips[i].traverseEquipEffects(), propName);
        }
    }
    this.getLife = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.calcProp("life");
    };
    this.getAttack = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.calcProp("attack");
    };
    this.getHit = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.calcProp("tap");
    };
    this.getRecover = function () {
        var val = this._data.levelDatas[this._lv].resurge.time;
        return val;
    };
    this.getCtrChance = function () {
        if (this.isLocked()) {
            return 0;
        }
        // 暴击概率需要除以100来进行逻辑计算
        return this.calcProp("ctr_chance") / 100;
    };
    this.getCtrModify = function () {
        if (this.isLocked()) {
            return 0;
        }
        // 暴击倍率需要除以100来进行逻辑计算
        return this.calcProp("ctr_modify") / 100;
    };
    this.getAnimateDelay = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.calcProp("atk_period");
    };

    this.doUnlock = function () {
        if (this._lv > 0) {
            return false;
        }
        return true;
    };

    this.printHeroProps = function () {
        cc.log("==================================");
        cc.log("id=" + this._id);
        cc.log("atk_period=" + this.getAnimateDelay());
        cc.log("life=" + this.getLife());
        cc.log("atk=" + this.getAttack());
        cc.log("tap=" + this.getHit());
        cc.log("ctr_chance=" + this.getCtrChance());
        cc.log("ctr_modify=" + this.getCtrModify());
        cc.log("==================================");
    };
    /**
     * 英雄升级
     */
    this.upgrade = function () {
        this._lv = this._lv + 1;
        for (var i = 0; i < player.heroes.length; i++) {
            if (player.heroes[i]["id"] === this.getId()) {
                player.heroes[i]['lv'] = this._lv;
                if(this._lv === 1){
                    player.heroes[i].life = this.getLife();
                }
                break;
            }
        }
    }
    this.refreshProps();

};

Hero.prototype.calcProp = function (propName,lvData) {
    var val = 0;
    var tmpVal = 0;
    var rate = 1.0;
    tmpVal = lvData||getLevelData(this._data, propName, this.getLv());
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
    tmpVal = PlayerData["tmp_" + propName + "_rate"];
    if (tmpVal) {
        rate += tmpVal / 100;
    }
    if (propName === "atk_period") {
        return val / rate;
    } else {
        return val * rate;
    }
};
