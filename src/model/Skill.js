/**
 * Created by highkay on 2015/12/29.
 */
var Skill = function (id, lv) {
    var id = id;
    var lv = lv;
    var data = dataSource.skills[id];
    this.getId = function () {
        return id;
    };
    this.getLv = function () {
        return lv;
    };
    this.getName = function () {
        return data.name;
    };
    this.getDesc = function () {
        return data.desc;
    };
    this.getEffect = function (key) {
        return getEffectValue(data, key, lv);
    };
    this.isUseable = function () {
        return data.useable;
    }
};