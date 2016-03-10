var player = {
    "id": "10001000",
    "name": "测试a",
    "vip": 1,
    "stage": "s100001",
    "stage_battle_num": 1,
    "into_stage_battle_timestamp": 0,
    "not_get_reward": null,//{"iron_key": 0,"silver_key": 0,"golden_key": 0, "gem": 0, "gold": 0},
    "first_time": "",
    "orders":[],
    // test data
    "resource": {
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
        "large_blood": 100,
    },
    'time': {
        "die": {},
        "cd": {}
    },
    //"cd":{"herosDie":{"":}},
    // release data
    //"resource": {
    //    "gold": 10,
    //    "gem": 10,
    //    "relic": 10,
    //    "wood": 0,
    //    "leather": 0,
    //    "stone": 0,
    //    "bronze": 0,
    //    "iron": 0,
    //    "crystal": 0,
    //    "rune": 0,
    //    "essence": 0,
    //    "iron_chest": 0,
    //    "iron_key": 0,
    //    "silver_chest": 0,
    //    "silver_key": 0,
    //    "golden_chest": 0,
    //    "golden_key": 0,
    //},
    "statistics": {
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
var PlayerData = {

    statistics_res_values: ["gem", "relic", "gold"],
    modelPlayer: null,
    modelSave: null,
    sequence: [],
    serverCurrentTime: 0,
    mails: {
        "readedMails": [],
        "unreadMails": []
    },
    init: function () {
        var localSave = localStorage.getItem("save");
        if (NetWork.isLoginSuccess()) {
            if (cc.isObject(this.modelSave)) {
                localSave = this.modelSave.content;
            } else {
                player.id = this.modelPlayer.id;
                player.name = this.modelPlayer.name;
                player.vip = this.modelPlayer.vip || 1;
                player.first_time = this.modelPlayer.createTime;
                localSave = null;
            }
        }
        if (localSave) {
            player = JSON.parse(localSave);
        }
        this.initPlayerData(localSave);
    },
    getHeroById: function (id) {
        for (var i in this.heroes) {
            if (this.heroes[i].getId() === id) {
                return this.heroes[i]
            }
        }
        return null;
    },
    initPlayerData: function (save) {
        for (var i in player.heroes) {
            this.heroes.push(new Hero(player.heroes[i]));
            //if (!save) {
            //    player.heroes[i].life = this.heroes[i].getLife();
            //}
        }
        if (!player.first_time) {
            player.first_time = PlayerData.getServerTime();
        }
        this.stageData = new Stage(player.stage);
        this.refreshGlobeProps();
        this.countOfflineReward();
        setInterval(function () {
            NetWork.updatePlayerSave();
        }.bind(this), 10 * 1000);
    },
    updatePlayer: function () {
        NetWork.updatePlayer(this.modelPlayer);
    }
    ,
    getHeroes: function () {
        return this.heroes;
    },
    delPlayer: function () {
        localStorage.removeItem("save");
    }
    ,
    getHeroesData: function (id) {
        return this.heroes[id];
    }
    ,
    getStageData: function () {
        return this.stageData;
    }
    ,
    getSkillsByHeroId: function (heroId) {
        var hero = this.getHeroesData(heroId);
        return hero.getSkills();
    }
    ,
    /**
     * 根据条件来累计所有英雄的属性
     *
     * @param prop 属性（方法）名称
     * @param dead 是否统计状态为死亡的英雄
     * @returns {number}
     */
    sumHeroesProp: function (prop, dead) {
        var val = 0;
        for (var i in this.heroes) {
            var hero = this.heroes[i];
            if (hero.getLv() > 0 && !hero.isDead()) {
                val += hero[prop]();
            }
        }
        return val;
    }
    ,
    getTotalAttack: function (dead) {
        return this.sumHeroesProp("getAttack", dead);
    }
    ,
    getTotalLife: function (dead) {
        return this.sumHeroesProp("getLife", dead);
    }
    ,
    getTotalHit: function (dead) {
        return this.sumHeroesProp("getHit", dead);
    }
    ,
    createResourceData: function (unit, val) {
        return {unit: unit, value: val};
    }
    ,
    updateResource: function (resources) {
        if (!resources) {
            return;
        }
        if (resources instanceof Array) {
            for (var i = 0; i < resources.length; i++) {
                this.updateSingleResource(resources[i]);
            }
        } else {
            this.updateSingleResource(resources);
        }
    }
    ,
    updateSingleResource: function (resource) {
        if (cc.isNumber(player.resource[resource.unit]) && (player.resource[resource.unit] >= 0)) {
            player.resource[resource.unit] += resource.value;
            if (resource.value > 0) {
                for (var i in this.statistics_res_values) {
                    if (resource.unit === this.statistics_res_values[i]) {
                        player.statistics["total_" + resource.unit] += resource.value;
                    }
                }
            }
        } else {
            cc.log("unknown resource type:" + resource.unit);
        }
    }
    ,
    updateIntoBattleTime: function () {
        player.into_stage_battle_timestamp = PlayerData.getServerTime();
    }
    ,
    getIntoBattleTime: function () {
        return player.into_stage_battle_timestamp;
    }
    ,
    countOfflineTime: function () {
        var intoBattleTime = this.getIntoBattleTime();
        if (intoBattleTime > 0) {
            var offlineTime = (Date.parse(new Date()) - intoBattleTime) / 1000;

            if (offlineTime > CONSTS.offline_reward_min_time) {
                if (offlineTime > CONSTS.offline_reward_max_time) {
                    offlineTime = CONSTS.offline_reward_max_time;
                }
                player.statistics.total_offline_time += offlineTime;
                return offlineTime / 60;
            }
        }
        return 0;
    },
    countOfflineReward: function () {
        var datas = this.getStageData().getOfflineReward();
        var offlineTime = this.countOfflineTime();
        if (offlineTime == 0) {
            return;
        }
        if (!cc.isObject(player.not_get_reward)) {
            player.not_get_reward = {};
        }
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].value) {
                if (typeof player.not_get_reward[datas[i].unit] === 'undefined') {
                    player.not_get_reward[datas[i].unit] = Math.floor(datas[i].value * offlineTime);
                } else {
                    player.not_get_reward[datas[i].unit] += Math.floor(datas[i].value * offlineTime);
                }
            }
        }

    }
    ,
    receiveOfflineReward: function () {
        var rewards = player.not_get_reward;
        var arrays = new Array();
        for (var key in rewards) {
            arrays.push(this.createResourceData(key, rewards[key]));
        }
        this.updateResource(arrays);
        customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, arrays);
        player.not_get_reward = null;//{"key": 0, "gem": 0, "gold": 0};
    }
    ,
    getAmountByUnit: function (unit) {
        return player.resource[unit];
    },
    getServerTime: function () {
        return this.serverCurrentTime;
    },

    getHeroDeadTime: function (id) {
        return player['time']['die'][id];
    },

    clearHeroDeadTime: function (id) {
        delete player['time']['die'][id];
        PlayerData.updatePlayer();
    },

    updateHeroDeadTime: function (id) {
        if (!player['time']['die'][id]) {
            sgt.RouterService.getCurrentTimestamp(function (result, data) {
                player['time']['die'][id] = data;
                PlayerData.updatePlayer();
            });
        }
    },
    heroes: [],
    stageData: {},
    globe_life_value: 0,
    globe_life_rate: 0,
    globe_attack_value: 0,
    globe_attack_rate: 0,
    /**
     * attack rate buff
     */
    buff_attack_rate: 0,
    globe_tap_value: 0,
    globe_tap_rate: 0,
    /**
     * tap rate buff
     */
    buff_tap_rate: 0,
    globe_gold_rate: 0,
    /**
     * gold rate buff
     */
    buff_gold_rate: 0,
    globe_atk_period_rate: 0,
    /**
     * attack_period rate buff
     */
    buff_atk_period_rate: 0,
    globe_ctr_chance_rate: 0,
    /**
     * ctr_chance rate buff
     */
    buff_ctr_chance_rate: 0,
    globe_ctr_modify_rate: 0,
    /**
     * ctr_modify rate buff
     */
    buff_ctr_modify_rate: 0,
    refreshGlobeProps: function () {
        /**
         * resum the globe prop from every heroes
         */
        this.globe_life_value = 0;
        this.globe_life_rate = 0;
        this.globe_attack_value = 0;
        this.globe_attack_rate = 0;
        this.globe_tap_value = 0;
        this.globe_tap_rate = 0;
        this.globe_gold_rate = 0;
        this.globe_atk_period_rate = 0;
        this.globe_ctr_chance_rate = 0;
        this.globe_ctr_modify_rate = 0;
        for (var i in this.heroes) {
            this.globe_life_value += this.heroes[i]["globe_life_value"];
            this.globe_life_rate += this.heroes[i]["globe_life_rate"];
            this.globe_attack_value += this.heroes[i]["globe_attack_value"];
            this.globe_attack_rate += this.heroes[i]["globe_attack_rate"];
            this.globe_tap_value += this.heroes[i]["globe_tap_value"];
            this.globe_tap_rate += this.heroes[i]["globe_tap_rate"];
            this.globe_gold_rate += this.heroes[i]["globe_gold_rate"];
            this.globe_atk_period_rate += this.heroes[i]["globe_atk_period_rate"];
            this.globe_ctr_chance_rate += this.heroes[i]["globe_ctr_chance_rate"];
            this.globe_ctr_modify_rate += this.heroes[i]["globe_ctr_modify_rate"];
        }
    }
    ,
    refreshAllHerosProps: function () {
        for (var i in this.heroes) {
            this.heroes[i].refreshProps();
        }
    }
    ,
    getTotalHeroNum: function () {
        var num = 0;
        for (var i in PlayerData.getHeroes()) {
            if (PlayerData.getHeroes()[i].getLv() > 0) {
                num++;
            }
        }
        return num;
    }
    ,
    getTotalHeroLevels: function () {
        var levels = 0;
        for (var i in PlayerData.getHeroes()) {
            levels += PlayerData.getHeroes()[i].getLv();

        }
        return levels;
    }

};

var effect_props = ["life", "attack", "tap", "atk_period", "ctr_chance", "ctr_modify", "gold"];
