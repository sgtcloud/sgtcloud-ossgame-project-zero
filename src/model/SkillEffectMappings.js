/**
 * Created by maron on 2016/1/6.
 */
var SkillEffectMappings = {
    "life_value":{"name":"生命值","type":"int"}
    ,
    "life_rate":{"name":"生命比例","type":"rate"}
    ,
    "attack_value":{"name":"攻击伤害","type":"int"}
    ,
    "attack_rate":{"name":"攻击伤害比例","type":"rate"}
    ,
    "tap_value":{"name":"点击伤害","type":"int"}
    ,
    "tap_rate":{"name":"点击伤害比例","type":"rate"}
    ,
    "ctr_chance_value":{"name":"暴击概率","type":"rate"}
    ,
    "ctr_modify_value":{"name":"暴击倍率","type":"rate"}
    ,
    "atk_period_value":{"name":"攻击间隔","type":"int"}
    ,
    "globe_life_value":{"name":"全体生命值","type":"int"}
    ,
    "globe_life_rate":{"name":"全体生命比例","type":"rate"}
    ,
    "globe_ctr_modify_rate":{"name":"全体暴击倍率","type":"rate"},
    "globe_attack_value":{"name":"全体攻击伤害","type":"int"}
    ,
    "globe_attack_rate":{"name":"全体攻击伤害比例","type":"rate"}
    ,
    "globe_tap_value":{"name":"全体点击伤害","type":"int"}
    ,
    "globe_tap_rate":{"name":"全体点击伤害比例","type":"rate"}
    ,
    "globe_atk_period_rate":{"name":"全体攻击间隔","type":"rate"}
    ,
    "globe_ctr_chance_rate":{"name":"全体暴击概率","type":"rate"}
    ,
    "globe_gold_rate":{"name":"金币获得比例","type":"rate"}
    ,
    "single_damage_once":{"name":"单体伤害输出","type":"int"}
    ,
    "multi_damage_once":{"name":"单次全体伤害","type":"int"}
    ,
    "buff_gold_rate":{"name":"获得金币比例","type":"rate"}
    ,
    "multi_damage_continuous":{"name":"持续群体伤害","type":"int"}
    ,
    "multi_recover_once":{"name":"全体治疗","type":"int"}
    ,
    "buff_tap_rate":{"name":"提升点击伤害比例","type":"rate"}
    ,
    "buff_attack_rate":{"name":"提升攻击伤害比例","type":"rate"}
    ,
    "buff_atk_period_rate":{"name":"缩短攻击间隔比例","type":"rate"}
    ,
    "buff_ctr_chance_rate":{"name":"提升暴击概率比例","type":"rate"}
    ,
    "buff_ctr_modify_rate":{"name":"提升暴击倍率比例","type":"rate"}
}
String.prototype.mapping = function(obj) {
    return this.replace(/{\s*\w+\s*}/gi, function(matchs) {
        var match=matchs.replace(/{\s*|\s*}/g, "")
        var returns;
        if (match.indexOf('_')>-1){
            var arr=match.split("_");
            if(arr.length>1){
                returns = obj[arr[0]][arr[1]];
            }
        }else {
            returns = obj[match];
        }
        return (returns + "") == "undefined" ? "" : returns;
    });
};
