var PlayerDataClass = cc.Class.extend({

    statistics_res_values: ["gem", "relic", "gold"],
    modelPlayer: null,
    modelSave: null,
    isUpdate: false,
    serverCurrentTime: 0,
    mails: {
        "readedMails": [],
        "unreadMails": []
    },
    ctor: function(){
       //this.init();
    },
    init: function (_player) {
        if(_player){
            this._player = _player;
        } else {
            this._player =  player;
            this._player .id = this.modelPlayer.id;
            this._player .name = this.modelPlayer.name;
            this._player .vip = this.modelPlayer.vip || 1;
            this._player .first_time = this.modelPlayer.createTime;
        }
        this.initPlayerData();
    },
    //获取当前角色存档对象 new hero前的player
    getPlayer: function(){
       return this._player ;
    },
    getPlayerId: function(){
       return this._player .id;
    },
    getHeroById: function (id) {
        for (var i in this.heroes) {
            if (this.heroes[i].getId() === id) {
                return this.heroes[i]
            }
        }
        return null;
    },
    initHeroes: function(){
        for (var i in this._player .heroes) {
            this.heroes.push(new Hero(this._player .heroes[i],this));
        }
    },
    initPlayerData: function () {
        this.initHeroes();
        if (!this._player .first_time) {
            this._player .first_time = this.getServerTime();
        }
        this.stageData = new Stage(this._player .stage);
        this.refreshGlobeProps();
        this.countOfflineReward();
        this.countPlayerMCardReward();
        setInterval(function () {
            Network.updatePlayerSave();
        }.bind(this), 10 * 1000);
    },
    updatePlayer: function () {
        Network.updatePlayer(this.modelPlayer);
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
            if (hero.getLv() > 0 && (!hero.isDead() || dead)) {
                val += hero[prop]();
            }
        }
        return val;
    }
    ,
    getTotalAttack: function (dead) {
        this._player .statistics.total_damage = this.sumHeroesProp("getAttack", dead);
        return this._player .statistics.total_damage;
    }
    ,
    getTotalLife: function (dead) {
        return this.sumHeroesProp("getLife", dead);
    }
    ,
    getTotalHit: function (dead) {
        this._player .statistics.total_tap = this.sumHeroesProp("getHit", dead);
        return this._player .statistics.total_tap;
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
        if (cc.isNumber(this._player .resource[resource.unit]) && (this._player .resource[resource.unit] >= 0)) {
            this._player .resource[resource.unit] += resource.value;
            if (resource.value > 0) {
                for (var i in this.statistics_res_values) {
                    if (resource.unit === this.statistics_res_values[i]) {
                        this._player .statistics["total_" + resource.unit] += resource.value;
                    }
                }
            }
        } else {
            cc.log("unknown resource type:" + resource.unit);
        }
    }
    ,
    updateIntoBattleTime: function () {
        this._player .into_stage_battle_timestamp = this.getServerTime();
    }
    ,
    getIntoBattleTime: function () {
        return this._player .into_stage_battle_timestamp;
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
                this._player .statistics.total_offline_time += offlineTime;
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
        if (!cc.isObject(this._player .not_get_reward)) {
            this._player .not_get_reward = {};
        }
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].value) {
                if (typeof this._player .not_get_reward[datas[i].unit] === 'undefined') {
                    this._player .not_get_reward[datas[i].unit] = Math.floor(datas[i].value * offlineTime);
                } else {
                    this._player .not_get_reward[datas[i].unit] += Math.floor(datas[i].value * offlineTime);
                }
            }
        }

    }
    ,
    receiveOfflineReward: function () {
        var rewards = this._player .not_get_reward;
        var arrays = new Array();
        for (var key in rewards) {
            arrays.push(this.createResourceData(key, rewards[key]));
        }
        this.updateResource(arrays);
        customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, arrays);
        this._player .not_get_reward = null;//{"key": 0, "gem": 0, "gold": 0};
    }
    ,
    getAmountByUnit: function (unit) {
        return this._player .resource[unit];
    },
    getServerTime: function () {
        return this.serverCurrentTime;
    },

    getHeroDeadTime: function (id) {
        return this._player ['time']['die'][id];
    },

    clearHeroDeadTime: function (id) {
        delete this._player ['time']['die'][id];
        this.updatePlayer();
    },

    updateHeroDeadTime: function (id) {
        if (!this._player ['time']['die'][id]) {
            sgt.RouterService.getCurrentTimestamp(function (result, data) {
                this._player ['time']['die'][id] = data;
                this.updatePlayer();
            });
        }
    },
    addPlayerNoPayOrders: function (order) {
        if (this._player .recovery_orders.indexOf(order) == -1) {
            this._player .recovery_orders.push(order);
            this.isUpdate = true;
            Network.updatePlayerSave();
        }
    },
    delePlayerNoPayOrdersById: function (order) {
        if (this._player .recovery_orders.indexOf(order) != -1) {
            this._player .recovery_orders.splice(this._player .recovery_orders.indexOf(order), 1);
        }
    },
    updatePlayerMCardInfo: function () {
        //已存在有效月卡，累加截止日期
        if (this._player .month_card_end_time > 0 && this._player .month_card_end_time >= this.serverCurrentTime) {
            this._player .month_card_end_time += CONSTS.monthCard_validity_timestamp;
        } else {
            this._player .month_card_start_time = this.serverCurrentTime;
            this._player .month_card_end_time = this.serverCurrentTime + CONSTS.monthCard_validity_timestamp;
        }
    },
    //需要在更新离线时间前执行。
    countPlayerMCardReward: function () {
        //判断是否有月卡
        if (this._player .month_card_end_time) {
            //判断月卡有效性
            if (getDays(this._player .into_stage_battle_timestamp, this._player .month_card_end_time) > 0) {
                var days = getDays(this._player .into_stage_battle_timestamp, this.serverCurrentTime);
                //判断是否可领取
                if (days > 0) {
                    //发送邮件
                    var attachment = JSON.stringify({
                        "unit": CONSTS.monthCard_daily_bonus.unit,
                        "value": (CONSTS.monthCard_daily_bonus.value * days)
                    });
                    Network.sendSystemMail('月卡title', '月卡内容', attachment, function (result, data) {
                    });
                }
            }
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
        for (var i in this.getHeroes()) {
            if (this.getHeroes()[i].getLv() > 0) {
                num++;
            }
        }
        return num;
    }
    ,
    getTotalHeroLevels: function () {
        var levels = 0;
        for (var i in this.getHeroes()) {
            levels += this.getHeroes()[i].getLv();

        }
        return levels;
    }

});
