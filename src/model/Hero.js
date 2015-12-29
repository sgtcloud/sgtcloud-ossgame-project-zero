var Hero = function (heroData) {
    var id = heroData.id;
    var lv = heroData.lv;
    var life = heroData.lift;
    var star = heroData.star;
    var data = dataSource.heros[id];
    var equips = [];
    var skills = [];

    for (var i in heroData.equips) {
        var equip = data.equips[i];
        var lv = heroData.equips[i];
        equips[i] = new Equip(equip, lv);
    }
    for (var i in heroData.skills) {
        var skill = data.skills[i];
        var lv = heroData.skills[i];
        skills[i] = new Skill(skill, lv);
    }
    this.isLocked = function () {
        return lv <= 0;
    };

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
    }
};
