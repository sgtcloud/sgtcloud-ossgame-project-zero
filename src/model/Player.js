var Player = {
    createPlayer: function () {
        cc.loader.load(["res/data/record.json"], function (err, data) {
            player = data[0];
            player.
            // console.log(datas.heros);
            callback.call(context);
        });
    },
    updatePlayer: function () {

    },
    delPlayer: function () {

    }
};


var Player = function (src) {
    var id = src.id;
    var name = src.name;
    var gold = src.gold;
    var gem = src.gem;
    var relic = src.relic;
    var vip = src.vip;
    var autoBossBattle = src.autoBossBattle;
    var stage = new Stage(src.stage);
    var heros = [];
    for (var i in src.heros) {
        heros[i] = new Hero(src.heros[i]);
    }
    this.getBattleNumOfStage()
    {
        return src.stage_battle_num;
    }
    this.getId = function () {
        return id;
    }

    this.getName = function () {
        return name;
    }

    this.getHeroCount = function () {
        return heros.length;
    }
    this.getHeroData = function (id) {
        return heros[id];
    }
    this.getStageData = function () {
        return stage;
    }

    this.getLife = function () {
        var val = 0;
        for (var i in heros) {
            var hero = heros[i];
            val += hero.getLife();
        }
        return val;
    }
    this.getAttack = function () {
        var val = 0;
        for (var i in heros) {
            var hero = heros[i];
            val += hero.getAttack();
        }
        return val;
    }
    this.getHit = function () {
        var val = 0;
        for (var i in heros) {
            var hero = heros[i];
            val += hero.getHit();
        }
        return val;
    }
    this.getGold = function () {
        return gold;
    }
    this.getGem = function () {
        return gem;
    }
    this.getRelic = function () {
        return relic;
    }
    this.getVip = function () {
        return vip;
    }
    this.isAutoBossBattle = function () {
        return autoBossBattle;
    }
    this.changeGold = function (val) {
        gold += val;
        if (gold < 0) {
            gold = 0;
        }
    }

    this.changeBonus = function (datas) {
        if (!datas) {
            return;
        }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            if (data.value) {
                switch (data.unit) {
                    case "gold":
                        gold += data.value;
                        break;
                    case "gem":
                        gem += data.value;
                        break;
                    case "relic":
                        relic += data.value;
                        break;
                }
            }
        }
    }

    // return {
    //   changeGold:function(price){
    //     gold += price;
    //   },
    //   notifyStateWin:function(){
    //     var bonus = battle.getBonus(battle.getState());
    //     gold += bonus;
    //   },
    //   notifyBattleWin:function(){
    //
    //   }
    // };
}
