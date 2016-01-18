/**
 * 英雄单体
 life_value 提升生命值
 life_rate 提升生命比例
 attack_value 提升秒伤值
 attack_rate 提升秒伤比例
 tap_value 提升秒伤比例
 tap_rate 提升点伤比例
 ctr_chance 暴击概率
 ctr_modify 暴击倍率
 atk_period 攻速（攻击间隔周期）

 全局
 globe_life_value
 globe_life_rate
 globe_attack_value
 globe_attack_rate
 globe_tap_value
 globe_tap_rate
 globe_atk_period_rate
 globe_ctr_chance_rate
 globe_ctr_modify_rate
 globe_gold_rate 提升金币获得比例

 buff
 tmp_attack_rate 临时提升秒伤比例
 tmp_tap_rate 临时提升点伤比例
 tmp_atk_period_rate 临时提升攻速比例
 tmp_ctr_chance_rate 临时提升暴击概率
 tmp_ctr_modify_rate 临时提升暴击倍率

 主动技能
 single_damage_once 单次单体伤害 （原来的magma_blaster，需要修改！）
 multi_damage_once 单次全体伤害
 buff_gold_rate 限定时间内提升金币获得比例
 multi_damage_continuous 持续群体伤害
 multi_recover_once 单次全体回复生命
 buff_tap_rate 限定时间内提升点伤比例
 buff_attack_rate 限定时间内提升秒伤比例
 buff_atk_period_rate 限定时间内提升攻速比例
 buff_ctr_chance_rate 限定时间内提升暴击概率
 buff_ctr_modify_rate 限定时间内提升暴击倍率
 * @constructor
 */

var Effect = function () {
    var data = {};

    this.get = function (tag) {
        var val = data[tag];
        if (val) {
            return val;
        }
        return 0;
    };

    this.getLifeValue = function () {
        var val = data['life_value'];
        if (val) {
            return val;
        }
        return 0;
    };
    this.getLifeModify = function () {
        var val = data['life_modify'];
        if (val) {
            return val;
        }
        return 0;
    };

    this.getAttackValue = function () {
        var val = data['attack_value'];
        if (val) {
            return val;
        }
        return 0;
    };
    this.getAttackModify = function () {
        var val = data['attack_modify'];
        if (val) {
            return val;
        }
        return 0;
    };
    this.getHitValue = function () {
        var val = data['hit_value'];
        if (val) {
            return val;
        }
        return 0;
    };
    this.get
};
