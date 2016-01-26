/**
 * Created by highkay on 2015/12/29.
 */
var StatisticsUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        this.statisticsLayer = ccs.csLoader.createNode(res.statistics_layer);
        this.root = this.statisticsLayer.getChildByName('root');
        var number = this.root.getChildByName('current').getChildByName('number');
        var total_hero = number.getChildByName('total_hero');
        var total_hero_levels = number.getChildByName('total_hero_levels');
        var total_gold_rate = number.getChildByName('total_gold_rate');
        var total_tap_rate = number.getChildByName('total_tap_rate');
        var total_life_rate = number.getChildByName('total_life_rate');
        var total_attack_rate = number.getChildByName('total_attack_rate');
        var total_attack_value = number.getChildByName('total_attack_value');
        var total_tap_value = number.getChildByName('total_tap_value');
        var total_life_value = number.getChildByName('total_life_value');
        var total_ctr_chance_rate = number.getChildByName('total_ctr_chance_rate');
        var total_ctr_modify_rate = number.getChildByName('total_ctr_modify_rate');
        var total_atk_period_rate = number.getChildByName('total_atk_period_rate');
        setIgnoreContentAdaptWithSize([total_hero,total_hero_levels,total_gold_rate,total_tap_rate,total_life_rate,total_attack_rate,total_attack_value,total_tap_value,total_life_value,total_ctr_chance_rate,total_ctr_modify_rate,total_atk_period_rate])
        total_hero.setString(PlayerData.getTotalHeroNum()+"k");
        total_hero_levels.setString(PlayerData.getTotalHeroLevels()+"m");
        total_gold_rate.setString(PlayerData.globe_gold_rate+PlayerData.tmp_gold_rate);
        total_tap_rate.setString(PlayerData.globe_tap_rate+PlayerData.tmp_tap_rate);
        total_life_rate.setString(PlayerData.globe_life_rate);
        total_attack_rate.setString(PlayerData.globe_attack_rate+PlayerData.tmp_attack_rate);
        total_attack_value.setString(PlayerData.getTotalAttack());
        total_tap_value.setString(PlayerData.getTotalHit()+"b");
        total_life_value.setString(PlayerData.getTotalLife());
        total_ctr_chance_rate.setString(PlayerData.globe_ctr_chance_rate+PlayerData.tmp_ctr_chance_rate);
        total_ctr_modify_rate.setString(PlayerData.globe_ctr_modify_rate+PlayerData.tmp_ctr_modify_rate);
        total_atk_period_rate.setString(PlayerData.globe_atk_period_rate+PlayerData.tmp_atk_period_rate);
        this.addChild(this.statisticsLayer);
    }
});