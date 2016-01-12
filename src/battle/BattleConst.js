var BattleConsts = {};
BattleConsts.Camp = {
    Player: 0,
    Enemy: 1
};

BattleConsts.Parameters = {
    getInitGoldNum: function () {
        return dataSource.constant.init_gold_num;
    },
    getInitGemNum: function () {
        return dataSource.constant.init_gem_num;
    },
    getInitRelicNum: function () {
        return dataSource.constant.init_relic_num;
    },
    getInitKeyNum: function () {
        return dataSource.constant.init_key_num;
    },
    getInitVipLevel: function () {
        return dataSource.constant.init_vip_level;
    },
    getInitStageId: function () {
        return dataSource.constant.init_stage_id;
    },
    getInitGeroId: function () {
        return dataSource.constant.init_hero_id;
    },
    getDailyBonusGemNum: function () {
        return dataSource.constant.daily_bonus_gem_num;
    },
    getOfflineRewardMinTime: function () {
        return dataSource.constant.offline_reward_min_time;
    },
    getOfflineRewardMaxTime: function () {
        return dataSource.constant.offline_reward_max_time;
    },
    getMoneyTreeOnePrice: function () {
        return dataSource.constant.money_tree_one_price;
    }
};

