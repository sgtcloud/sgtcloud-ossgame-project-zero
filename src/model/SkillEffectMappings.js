/**
 * Created by maron on 2016/1/6.
 */
var SkillEffectMappings = {
    "attack_rate": {"name": "基础秒伤", "type": "rate","clickEvent":function(){}},
    "attack_value": {"name": "秒伤值", "type": "int","clickEvent":function(){}},
    "magma_blaster":{"name": "秒伤值1", "type": "int","clickEvent":function(){}},
    "life_rate": {"name": "基础生命值", "type": "rate","clickEvent":function(hero,skill,equip){
        var effects=skill.traverseSkillEffects();
        for (var i in effects){
            var effect= effects[i]
            if(effect['type']==='life_rate'){
                hero.setLife(parseInt((1+effect['value']/100)*hero.getLife()));
                break;
            }
        }
    }},
    "life_value": {"name": "生命值", "type": "int","clickEvent":function(hero,skill,equip){
        var effects=skill.traverseSkillEffects();
        for (var i in effects){
           var effect= effects[i]
            if(effect['type']==='life_value'){
                hero.setLife(parseInt(hero.getLife()+effect['value']));
                break;
            }
        }
    }},
    "tap_value": {"name": "点伤值", "type": "int","clickEvent":function(){}},
    "tap_rate": {"name": "基础点伤", "type": "rate","clickEvent":function(){}}
}
String.prototype.mapping = function(obj) {
    return this.replace(/{\s*\w+\s*}/gi, function(matchs) {
        var match=matchs.replace(/{\s*|\s*}/g, "")
        var arr=match.split("_");
        var returns = obj[arr[0]][arr[1]];
        return (returns + "") == "undefined" ? "" : returns;
    });
};
