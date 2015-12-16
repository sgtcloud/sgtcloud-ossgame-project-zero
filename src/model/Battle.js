var Enemy = function (src) {
    var id = src.id;
    var lv = src.lv;
    var data = datas.enemys[id];

    this.getId = function () {
        return id;
    }
    this.getLv = function () {
        return lv;
    }
    this.getName = function () {
        return data.name;
    }
    this.getFile = function () {
        return data.file;
    }
    this.getLife = function () {
        return getLevelData(data, "life", lv);
    }
    this.getAttack = function () {
        return getLevelData(data, "attack", lv);
    }
    this.getAnimateDelay = function () {
        var val = getLevelData(data, "atk_period", lv);
        return val;
    }
    this.getBonus = function () {
        return getLevelData(data, "bonus", lv);
    }
}

var Stage = function (id) {
    //var id = id;
    var data = datas.stages[id];

    cc.log("stage=" + data)

    this.goToNext = function () {
        if (data.next) {
            id = data.next;
            data = datas.stages[id];
            return true;
        }
        return false;
    }

    this.getId = function () {
        return id;
    }
    this.getRandomBattleCount = function () {
        return data.battleNum;
    }
    this.getRandomEnemyCount = function () {
        var min = data.enemyNumMin;
        var max = data.enemyNumMax;
        var rand = Math.round(Math.random() * (max - min));
        return min + rand;
    }
    this.getRandomEnemyData = function () {
        var length = data.enemyTypes.length;
        var rand = Math.round(Math.random() * (length - 1));
        var temp = data.enemyTypes[rand];
        cc.log("random enemy=" + temp)
        return new Enemy(temp);
    }
    this.getRandomEnemyDatas = function () {
        var enemys = [];
        var count = this.getRandomEnemyCount();
        for (var i = 0; i < count; i++) {
            enemys.push(this.getRandomEnemyData());
        }
        return enemys;
    }
    this.getBossEnemDatas = function () {
        var enemys = [];
        var count = data.bossBattle.length;
        for (var i = 0; i < count; i++) {
            enemys.push(new Enemy(data.bossBattle[i]));
        }
        return enemys;
    }
    this.getBossTimeMax = function () {
        return data.bossTime;
    }

}
