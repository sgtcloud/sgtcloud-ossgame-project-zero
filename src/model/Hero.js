var Hero = function (heroData) {
    var id = heroData.id;
    var lv = heroData.lv;
    var effect_props = ["life", "attack", "tap", "atk_period", "ctr_chance", "ctr_modify"];
    var star = heroData.star;
    var data = dataSource.heros[id];
    var equips = [];
    var skills = [];
    var icon = data.icon;

    for (var i in data.equips) {
        var equip = data.equips[i];
        var equipsLv = data.equips[i];
        equips[i] = new Equip(equip, equipsLv);
    }
    for (var i in data.skills) {
        var skillId = data.skills[i];
        var skill = readCache(skillId);
        var skillLv = (skill && skill['level']) || 0;
        skills[i] = new Skill(skillId, skillLv, id);
    }
    function readCache(skillId) {
        var skill = heroData.skills[skillId]
        if (skill) {
            return skill;
        }
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
        return data.levelDatas.length;
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
    };
    this.isLocked = function () {
        return lv <= 0;
    };
    this.isMaxLevel = function () {
        return lv >= this.getMaxLevel();
    }

    this.getNextLevelUpgrade = function () {
        var level = this.getLv();
        var cost = getLevelData(data, 'upgrade', level + 1);
        return cost;
    };

    this.getLevelData = function (level) {
        return getSpecificLevelData(data, level || lv);
    }

    this.getResurge = function () {
        return getLevelData(data, 'resurge', this.getLv())
    }

    this.getId = function () {
        return id;
    };
    this.getFile = function () {
        return data.file;
    };
    this.getLv = function () {
        return lv;
    };
    this.getName = function () {
        return data.name;
    };
    this.getStar = function () {
        return star;
    };

    this.getEquipCount = function () {
        return equips.length;
    };
    this.getEquipData = function (i) {
        return equips[i];
    };
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
    this.calcProp = function (propName) {
        var val = 0;
        var tmpVal = 0;
        var rate = 1.0;
        tmpVal = getLevelData(data, propName, lv);
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = this[propName + "_value"];
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = PlayerData["globe_" + propName + "_value"]
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
        var val = data.levelDatas[lv - 1].resurge.time;
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
        if (lv > 0) {
            return false;
        }
        return true;
    };
    /**
     * 英雄升级
     */
    this.upgrade = function () {
        lv = lv + 1;
        for (var i = 0; i < player.heroes.length; i++) {
            if (player.heroes[i]["id"] === this.getId()) {
                player.heroes[i]['lv'] = lv;
            }
        }
    }
    this.refreshProps();

};
