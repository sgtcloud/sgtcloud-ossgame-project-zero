/**
 * Created by highkay on 2015/12/29.
 */
var StatisticsPanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.statisticsLayer = ccs.csLoader.createNode(res.statistics_layer);
        this.root = this.statisticsLayer.getChildByName('root');
        var number = this.root.getChildByName('current').getChildByName('number');
        var cumulative_number = this.root.getChildByName('cumulative').getChildByName('number');
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
        var total_gold = cumulative_number.getChildByName('statistics.total_gold');
        var total_relic = cumulative_number.getChildByName('statistics.total_relic');
        var total_fairy = cumulative_number.getChildByName('statistics.total_fairy');
        var total_chest_open = cumulative_number.getChildByName('statistics.total_chest_open');
        var total_enemy_kill = cumulative_number.getChildByName('statistics.total_enemy_kill');
        var total_boss_kill = cumulative_number.getChildByName('statistics.total_boss_kill');
        var total_max_level = cumulative_number.getChildByName('statistics.total_max_level');
        setIgnoreContentAdaptWithSize([total_hero,total_hero_levels,total_gold_rate,total_tap_rate,total_life_rate,
            total_attack_rate,total_attack_value,total_tap_value,total_life_value,total_ctr_chance_rate,total_ctr_modify_rate,total_atk_period_rate,
            total_gold,total_relic,total_fairy,total_chest_open,total_enemy_kill,total_boss_kill,total_max_level]);

        total_hero.setString(formatNumber(PlayerData.getTotalHeroNum()));
        total_hero_levels.setString(formatNumber(PlayerData.getTotalHeroLevels()));
        total_gold_rate.setString(formatNumber(PlayerData.globe_gold_rate+PlayerData.buff_gold_rate,"rate"));
        total_tap_rate.setString(formatNumber(PlayerData.globe_tap_rate+PlayerData.buff_tap_rate,"rate"));
        total_life_rate.setString(formatNumber(PlayerData.globe_life_rate,"rate"));
        total_attack_rate.setString(formatNumber(PlayerData.globe_attack_rate+PlayerData.buff_attack_rate,"rate"));
        total_attack_value.setString(formatNumber(PlayerData.getTotalAttack()));
        total_tap_value.setString(formatNumber(PlayerData.getTotalHit(true)));
        total_life_value.setString(formatNumber(PlayerData.getTotalLife()));
        total_ctr_chance_rate.setString(formatNumber(PlayerData.getTotalCtrChance()*100,"rate"));
        total_ctr_modify_rate.setString(formatNumber(PlayerData.getTotalCtrModify()*100,"rate"));
        total_atk_period_rate.setString(formatNumber(PlayerData.getTotalAtkPeriod()));
        total_gold.setString(formatNumber(player.statistics.total_gold));
        total_relic.setString(formatNumber(player.statistics.total_relic));
        total_fairy.setString(formatNumber(player.statistics.total_fairy));
        total_chest_open.setString(formatNumber(player.statistics.total_chest_open));
        total_enemy_kill.setString(formatNumber(player.statistics.total_enemy_kill));
        total_boss_kill.setString(formatNumber(player.statistics.total_boss_kill));
        total_max_level.setString(formatNumber(player.statistics.total_max_level));
        //this.setPosition(cc.p(0,100));
    },
    openStatisticsPopup: function(){
        GamePopup.openPopup(this.statisticsLayer,null,false);
    }
});
StatisticsPanel.open = function(){
    var statistics = new StatisticsPanel();
    statistics.openStatisticsPopup();
}