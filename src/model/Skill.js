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
    this.getNextLevelUpgrade=function(){
        var level=this.getLv();
        var cost=getLevelData(data,'upgrade',level+1);
        return cost;
    };
    this.getLevelData=function(level){
        return getSpecificLevelData(data,level||lv);
    }
    this.isMaxLevel=function(){
        return lv>=data.levelDatas.length;
    };
    this.upgrade=function(){
        lv++;
    }
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
    /**
     * 遍历制定级别的所有技能效果
     * @param lv 级别，默认为当前级别
     * @returns {'技能type':{'value':111,'index':'排列位置'}}
     */
    this.traverseSkillEffects=function (lv){
        var skill=this.getLevelData(lv);
        var effects={};
        for (var key in skill){
            //狗日的微信浏览器中没有startsWith
            if(key.indexOf("effect")==0){
                var effect=skill[key];
                effects[effect['type']]=(effect);
                effect.index=parseInt(key.replace("effect",""));
            }
        }
        return effects;
    }
};