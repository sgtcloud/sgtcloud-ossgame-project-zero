var Hero = function (heroData) {
    var id = heroData.id;
    var lv = heroData.lv;
    var effect_props = ["life", "atk", "hit"];
    var star = heroData.star;
    var data = dataSource.heros[id];
    var equips = [];
    var skills = [];


    for (var i in heroData.equips) {
        var equip = data.equips[i];
        var equipsLv = heroData.equips[i];
        equips[i] = new Equip(equip, equipsLv);
    }
    for (var i in heroData.skills) {
        var skill = data.skills[i];
        var skillLv = heroData.skills[i];
        skills[i] = new Skill(skill, skillLv);
    }
    for (var i in effect_props) {
        this[effect_props[i]] = 0;
        this[effect_props[i] + "_value"] = 0;
        this[effect_props[i] + "_rate"] = 0;
    };
    this.refreshProps = function () {
        for (var i in effect_props) {
            this.calcProp(effect_props[i]);
        }
    };
    this.getProp = function (propName) {
        return this[propName];
    };
    this.isLocked = function () {
        return lv <= 0;
    };
    this.isMaxLevel = function () {
        return lv >= data.levelDatas.length;
    }

    this.getNextLevelUpgrade = function () {
        var level = this.getLv();
        var cost = getLevelData(data, 'upgrade', level + 1);
        return cost;
    };

    this.getLevelData = function (level) {
        return getSpecificLevelData(data, level || lv);
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
    this.calcArrayEffect = function (array, propName) {
        for (var i in array) {
            var effects = array[i].getEffect();
            for (var j in effects) {
                if (effects[j].type === propName + "_value") {
                    this[propName + "_value"] += effects[j].value;
                }
                else if (effects[j].type === propName + "_rate") {
                    this[propName + "_rate"] += effects[j].value;
                }
                else if (effects[j].type === "globe_" + propName + "_value") {
                    PlayerData["globe_" + propName + "_value"] += effects[j].value;
                }
                else if (effects[j].type === "globe_" + propName + "_rate") {
                    PlayerData["globe_" + propName + "_rate"] += effects[j].value;
                }
            }
        }
    };
    this.calcSkillEffect = function (propName) {
        this.calcArrayEffect(skills, propName);
    }
    this.calcEquipEffect = function (propName) {
        this.calcArrayEffect(equips, propName);
    }
    this.calcProp = function (propName) {
        this.calcSkillEffect(propName);
        this.calcEquipEffect(propName);
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
            rate += tmpVal;
        }
        tmpVal = PlayerData["globe_" + propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal;
        }
        this[propName] = val * rate;
    };
    this.getLife = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.getProp("life");
    };
    this.getAttack = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.getProp("atk");
    };
    this.getHit = function () {
        if (this.isLocked()) {
            return 0;
        }
        return this.getProp("hit");
    };
    this.getRecover = function () {
        var val = data.levelDatas[lv - 1].resurge.time;
        return val;
    };
    this.getCtrChance = function () {
        var val = data.ctr_chance;
        return val;
    };
    this.getCtrModify = function () {
        var val = data.ctr_modify;
        return val;
    };
    this.getAnimateDelay = function () {
        var val = getLevelData(data, "atk_period", lv);
        return val;
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
    }
    this.refreshProps();
};
