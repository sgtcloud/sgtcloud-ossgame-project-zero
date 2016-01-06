var Hero = function (heroData) {
    var id = heroData.id;
    var lv = heroData.lv;
    var life = heroData.lift;
    var star = heroData.star;
    var data = dataSource.heros[id];
    var equips = [];
    var skills = [];
    var icon = data.icon;

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
    this.getIcon = function () {
        return icon;
    }


    this.getMaxLevel=function(){
        return data.levelDatas.length;
    }


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
    this.getSkills=function(){
        return skills;
    }
    this.getLife = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "life", lv);
        for (var i in equips) {
            val += equips[i].getEffect('life_value');
        }
        return val;
    };

    this.getAttack = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "attack", lv);
        for (var i in equips) {
            val += equips[i].getEffect('attack_value');
        }
        return val;
    };
    this.getHit = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "tap", lv);
        for (var i in equips) {
            val += equips[i].getEffect('tap_value');
        }
        return val;
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
        for (var i = 0; i < player.heroes.length; i++) {
            if (player.heroes[i]["id"] === this.getId()) {

            }
        }
    }
};
