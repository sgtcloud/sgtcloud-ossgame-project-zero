var player = {
    "id": "10001000",
    "name": "测试a",
    "gold": 10,
    "gem": 10,
    "relic": 10,
    "vip": 1,
    "stage": "s100001",
    "stage_battle_num": 1,
    "into_stage_battle_timestamp":0,
    "not_get_reward":0,
    "heroes": [
        {
            "id": "h101",
            "lv": 1,
            "life": 0,
            "star": 0,
            "skills": [
                1,
                1
            ],
            "equips": [
                1,
                1
            ]
        },
        {
            "id": "h102",
            "lv": 1,
            "life": 0,
            "star": 0,
            "skills": [
                1,
                1
            ],
            "equips": [
                1,
                1
            ]
        }
    ]
};
var PlayerData = {
    init: function () {
        var save = localStorage.getItem("save");
        if (save) {
            player = JSON.parse(save);
        }
        this.initPlayerData(save);
    },
    initPlayerData: function (save) {
        for (var i in player.heroes) {
            this.heroesData[i] = new Hero(player.heroes[i]);
            if (!save) {
                player.heroes[i].life = this.heroesData[i].getLife();
            }
        }
        this.stageData = new Stage(player.stage);
        this.countOfflineReward();
    },
    updatePlayer: function () {
        localStorage.setItem("save", JSON.stringify(player));
    }
    ,
    delPlayer: function () {
        localStorage.removeItem("save");
    }
    ,
    getHeroesData: function (id) {
        return this.heroesData[id];
    }
    ,
    getStageData: function () {
        return this.stageData;
    }
    ,
    sumHeroesProp: function (prop) {
        var val = 0;
        for (var i in this.heroesData) {
            var hero = this.heroesData[i];
            val += hero[prop]();
        }
        return val;
    }
    ,
    getTotalAttck: function () {
        return this.sumHeroesProp("getAttack");
    }
    ,
    getTotalLife: function () {
        return this.sumHeroesProp("getLife");
    }
    ,
    getTotalHit: function () {
        return this.sumHeroesProp("getHit");
    }
    ,
    createResourceData: function (unit, val) {
        return {unit: unit, value: val};
    }
    ,
    consumeResource: function (datas) {
        if (!datas) {
            return;
        }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            if (data.value) {
                switch (data.unit) {
                    case "gold":
                        player.gold += data.value;
                        break;
                    case "gem":
                        player.gem += data.value;
                        break;
                    case "relic":
                        player.relic += data.value;
                        break;
                }
            }
        }
    }
    ,
    updateIntoBattleTime: function(){
        cc.log("into_stage_battle_timestamp:"+Date.parse(new Date()));
        player.into_stage_battle_timestamp = Date.parse(new Date());
    }
    ,
    getIntoBattleTime: function(){
        cc.log("into_stage_battle_timestamp:"+player.into_stage_battle_timestamp);
        return player.into_stage_battle_timestamp;
    }
    ,
    countOfflineReward: function(){
        var intoBattleTime = this.getIntoBattleTime();
        if(intoBattleTime > 0){
            var offlineTime = Math.floor((Date.parse(new Date()) - intoBattleTime)/(1000 * 60));
            var reward = 0;
            if(offlineTime > 3 ){
                if(offlineTime > (60 * 24)){
                    offlineTime = 60 * 24;
                }
                reward = offlineTime * this.getStageData().getOfflineReward();
            }
            player.not_get_reward += reward;
            //this.updatePlayer();
        }
    }
    ,
    receiveOfflineReward: function(){
        this.consumeResource([this.createResourceData("gold",player.not_get_reward)]);
        player.not_get_reward = 0;
    }
    ,
    getAmountByUnit:function(unit){
        switch (unit) {
            case "gold":
                return player.gold;
            case "gem":
                return player.gem;
            case "relic":
                return player.relic ;
        }
        return 0;
    },
    heroesData: [],
    stageData: {},
    globe_life_value: 0,
    globe_life_rate: 0,
    globe_atk_value: 0,
    globe_atk_rate: 0,
    globe_hit_value: 0,
    globe_hit_rate: 0,
};

