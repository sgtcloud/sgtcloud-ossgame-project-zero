/**
 * Created by highkay on 2015/12/29.
 */
var StatisticsUnit = cc.Node.extend({
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
            total_gold,total_relic,total_fairy,total_chest_open,total_enemy_kill,total_boss_kill,total_max_level])
        this.convert = function(data,type){
            if(typeof type === 'undefined'){
                if(data >= 0 && data <1000){
                    return data;
                }else if(data >= 1000 && data < 1000000){
                    return (data/1000.0).toFixed(2)+"k";
                }else if(data >= 1000000 && data < 1000000000){
                    return (data/1000000.0).toFixed(2)+"m";
                }else {
                    return (data/1000000000.0).toFixed(2)+"b";
                }
            }else if(type == 'rate'){
                return data.toFixed(2)+"%";
            }
        }
        total_hero.setString(this.convert(PlayerData.getTotalHeroNum()));
        total_hero_levels.setString(this.convert(PlayerData.getTotalHeroLevels()));
        total_gold_rate.setString(this.convert(PlayerData.globe_gold_rate+PlayerData.tmp_gold_rate,"rate"));
        total_tap_rate.setString(this.convert(PlayerData.globe_tap_rate+PlayerData.tmp_tap_rate,"rate"));
        total_life_rate.setString(this.convert(PlayerData.globe_life_rate,"rate"));
        total_attack_rate.setString(this.convert(PlayerData.globe_attack_rate+PlayerData.tmp_attack_rate,"rate"));
        total_attack_value.setString(this.convert(PlayerData.getTotalAttack()));
        total_tap_value.setString(this.convert(PlayerData.getTotalHit()));
        total_life_value.setString(this.convert(PlayerData.getTotalLife()));
        total_ctr_chance_rate.setString(this.convert(PlayerData.globe_ctr_chance_rate+PlayerData.tmp_ctr_chance_rate,"rate"));
        total_ctr_modify_rate.setString(this.convert(PlayerData.globe_ctr_modify_rate+PlayerData.tmp_ctr_modify_rate,"rate"));
        total_atk_period_rate.setString(this.convert(PlayerData.globe_atk_period_rate+PlayerData.tmp_atk_period_rate,"rate"));
        total_gold.setString(this.convert(player.statistics.total_gold));
        total_relic.setString(this.convert(player.statistics.total_relic));
        total_fairy.setString(this.convert(player.statistics.total_fairy));
        total_chest_open.setString(this.convert(player.statistics.total_chest_open));
        total_enemy_kill.setString(this.convert(player.statistics.total_enemy_kill));
        total_boss_kill.setString(this.convert(player.statistics.total_boss_kill));
        total_max_level.setString(this.convert(player.statistics.total_max_level));
        //this.setPosition(cc.p(0,100));
        this.addChild(this.statisticsLayer);
    }
});