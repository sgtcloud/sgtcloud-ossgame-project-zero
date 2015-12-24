var Stage = function (id) {
    //var id = id;
    var data = dataSource.stages[id];

    this.goToNext = function () {
        if (data.next) {
            id = data.next;
            data = dataSource.stages[id];
            return true;
        }
        return false;
    };

    this.getPrevStageId = function () {
        for (var stageId in dataSource.stages) {
            var stage = dataSource.stages[stageId];
            if (stage.next == id) {
                return stageId;
            };
        }
        return null;
    };

    this.getBg = function () {
        return data.bg;
    };
    this.getIcon = function () {
        return data.icon;
    }
    this.getStageNum = function () {
        return data.stageNum;
    };
    this.getNextStageId = function () {
        return data.next;
    };

    this.getId = function () {
        return id;
    };
    this.getRandomBattleCount = function () {
        return data.battleNum;
    };
    this.getRandomEnemyCount = function () {
        var min = data.enemyNumMin;
        var max = data.enemyNumMax;
        var rand = Math.round(Math.random() * (max - min));
        return min + rand;
    };
    this.getRandomEnemyData = function () {
        var length = data.enemyTypes.length;
        var rand = Math.round(Math.random() * (length - 1));
        var temp = data.enemyTypes[rand];
        return new Enemy(temp);
    };
    this.getRandomEnemyDatas = function () {
        var enemys = [];
        var count = this.getRandomEnemyCount();
        for (var i = 0; i < count; i++) {
            enemys.push(this.getRandomEnemyData());
        }
        return enemys;
    };
    this.getBossEnemDatas = function () {
        var enemys = [];
        var count = data.bossBattle.length;
        for (var i = 0; i < count; i++) {
            enemys.push(new Enemy(data.bossBattle[i]));
        }
        return enemys;
    };
    this.getBossTimeMax = function () {
        return data.bossTime;
    };

};
