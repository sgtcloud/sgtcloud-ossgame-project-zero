var player = {
    "id": "10001000",
    "name": "测试a",
    "vip": 1,
    "stage": "s100001",
    "stage_battle_num": 1,
    "into_stage_battle_timestamp": 0,
    "not_get_reward": null,//{"iron_key": 0,"silver_key": 0,"golden_key": 0, "gem": 0, "gold": 0},
    "first_time": 0,
    "recovery_orders": [],
    "completed_order_total": {},
    "first_recharge_status": 0,
    "month_card_start_time": 0,
    "month_card_end_time": 0,
    // test data
    /*"resource": {
        "gold": 1000000,
        "gem": 10000,
        "relic": 10000,
        "wood": 100,
        "leather": 100,
        "stone": 100,
        "bronze": 100,
        "iron": 100,
        "crystal": 100,
        "rune": 100,
        "essence": 100,
        "iron_chest": 100,
        "iron_key": 100,
        "silver_chest": 100,
        "silver_key": 100,
        "golden_chest": 100,
        "golden_key": 100,
        "small_blood": 100,
        "middle_blood": 100,
        "large_blood": 100
    },*/
    'time': {
        "die": {},
        "cd": {}
    },
    //"cd":{"herosDie":{"":}},
    // release data
    "resource": {
        "gold": 10,
        "gem": 10,
        "relic": 10,
        "wood": 0,
        "leather": 0,
        "stone": 0,
        "bronze": 0,
        "iron": 0,
        "crystal": 0,
        "rune": 0,
        "essence": 0,
        "iron_chest": 0,
        "iron_key": 0,
        "silver_chest": 0,
        "silver_key": 0,
        "golden_chest": 0,
        "golden_key": 0,
        "small_blood": 0,
        "middle_blood": 0,
        "large_blood": 0
    },
    // release data
    "statistics": {
        "total_fairy": 0,
        "total_gem": 10,
        "total_relic": 10,
        "total_gold": 10,
        "total_tap": 0,
        "total_damage": 0,
        "total_enemy_kill": 0,
        "total_boss_kill": 0,
        "total_chest_open": 0,
        "total_max_level": 0,
        "total_offline_time": 0,
        "total_play_time": 0
    },
    // test data
    /*"statistics": {
        "total_fairy": 0,
        "total_gem": 10000,
        "total_relic": 10000,
        "total_gold": 1000000,
        "total_tap": 0,
        "total_damage": 0,
        "total_enemy_kill": 0,
        "total_boss_kill": 0,
        "total_chest_open": 0,
        "total_max_level": 0,
        "total_offline_time": 0,
        "total_play_time": 0
    },*/
    "arena": {
        "times": 5
    },
    "heroes": [
        {
            "id": "h101",
            "lv": 1,
            "life": 200,
            "star": 0,
            "skills": {
                //"技能ID":{"leve":""}
            },
            "equips": {
                //"装备ID":{}
            }
        },
        {
            "id": "h102",
            "lv": 0,
            "life": 0,
            "star": 0,
            "skills": {},
            "equips": {}
        }, {
            "id": "h103",
            "lv": 0,
            "life": 0,
            "star": 0,
            "skills": {
                //"技能ID":{"leve":""}
            },
            "equips": {}
        }, {
            "id": "h104",
            "lv": 0,
            "life": 0,
            "star": 0,
            "skills": {
                //"技能ID":{"leve":""}
            },
            "equips": {}
        }, {
            "id": "h105",
            "lv": 0,
            "life": 0,
            "star": 0,
            "skills": {
                //"技能ID":{"leve":""}
            },
            "equips": {}
        }
    ]
};
var effect_props = ["life", "attack", "tap", "atk_period", "ctr_chance", "ctr_modify", "gold"];
var PlayerData = new PlayerDataClass();

var arenaHeroPlayerData;

var arenaEnemyPlayerData;

PlayerDataClass.create = function (playerId) {
    if (playerId) {
        if (PlayerDataClass.prototype.getArenaBattleStatus()) {
            if (playerId === player.id) {
                return arenaHeroPlayerData;
            } else {
                return arenaEnemyPlayerData;
            }
        }
    }
    return PlayerData;
};