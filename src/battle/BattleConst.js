var BattleConsts = {};
BattleConsts.Camp = {
    Player: 0,
    Enemy: 1
};

BattleConsts.Parameters = {
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

