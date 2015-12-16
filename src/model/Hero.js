var Equip = function (id, lv) {
    var id = id;
    var lv = lv;
    var data = datas.equips[id];


    this.getId = function () {
        return id;
    }
    this.getLv = function () {
        return lv;
    }
    this.getName = function () {
        return data.name;
    }
    this.getDesc = function () {
        return data.desc;
    }
    this.getAffect = function (key) {
        return getAffectValue(data, key, lv);
    }

}
var Skill = function (id, lv) {
    var id = id;
    var lv = lv;
    var data = datas.skills[id];
    this.getId = function () {
        return id;
    }
    this.getLv = function () {
        return lv;
    }
    this.getName = function () {
        cc.log("skill name=" + data.name);
        return data.name;
    }
    this.getDesc = function () {
        return data.desc;
    }
    this.getAffect = function (key) {
        return getAffectValue(data, key, lv);
    }
    this.isUseable = function () {
        return data.useable;
    }
}
var Hero = function (record) {
    var id = record.id;
    var lv = record.lv;
    var star = record.star;
    var data = datas.heros[id];
    var equips = [];
    var skills = [];

    for (var i in record.equips) {
        var equip = data.equips[i];
        var lv = record.equips[i];
        equips[i] = new Equip(equip, lv);
    }
    for (var i in record.skills) {
        var skill = data.skills[i];
        var lv = record.skills[i];
        skills[i] = new Skill(skill, lv);
    }
    this.isLocked = function () {
        return lv <= 0;
    }

    this.getId = function () {
        return id;
    }
    this.getFile = function () {
        return data.file;
    }
    this.getLv = function () {
        return lv;
    }
    this.getName = function () {
        cc.log("hero name=" + data.name);
        return data.name;
    }
    this.getStar = function () {
        return star;
    }

    this.getEquipCount = function () {
        return equips.length;
    }
    this.getEquipData = function (i) {
        return equips[i];
    }
    this.getSkillCount = function () {
        return skills.length;
    }
    this.getSkillData = function (i) {
        return skills[i];
    }
    this.getLife = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "life", lv);
        for (var i in equips) {
            val += equips[i].getAffect('life_value');
        }
        return val;
    }
    this.getAttack = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "attack", lv);
        for (var i in equips) {
            val += equips[i].getAffect('attack_value');
        }
        return val;
    }
    this.getHit = function () {
        if (this.isLocked()) {
            return 0;
        }
        var val = getLevelData(data, "tap", lv);
        for (var i in equips) {
            val += equips[i].getAffect('tap_value');
        }
        return val;
    }
    this.getRecover = function () {
        var val = data.levelDatas[lv - 1].resurge.time;
        return val;
    }
    this.getCtrChance = function () {
        var val = data.ctr_chance;
        return val;
    }
    this.getCtrModify = function () {
        var val = data.ctr_modify;
        return val;
    }
    this.getAnimateDelay = function () {
        var val = getLevelData(data, "atk_period", lv);
        return val;
    }

    this.doUnlock = function () {
        if (lv > 0) {
            return false;
        }
        return true;
    }
}
