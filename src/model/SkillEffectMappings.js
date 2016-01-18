/**
 * Created by maron on 2016/1/6.
 */
var SkillEffectMappings = {
    "attack_rate": {"name": "基础秒伤", "type": "rate"},
    "attack_value": {"name": "秒伤值", "type": "int"},
    "magma_blaster":{"name": "", "type": "int"},
    "life_rate": {"name": "基础生命值", "type": "rate"},
    "life_value": {"name": "生命值", "type": "int"},
    "tap_value": {"name": "点伤值", "type": "int"},
    "tap_rate": {"name": "基础点伤", "type": "rate"}
}
String.prototype.mapping = function(obj) {
    return this.replace(/{\s*\w+\s*}/gi, function(matchs) {
        var match=matchs.replace(/{\s*|\s*}/g, "")
        var arr=match.split("_");
        var returns = obj[arr[0]][arr[1]];
        return (returns + "") == "undefined" ? "" : returns;
    });
};
