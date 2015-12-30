var Stage = function (id) {
    //var id = id;
    var data = dataSource.stages[id];

    this.goToNextStage = function () {
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
            }
        }
        return null;
    };

    this.isBossBattle = function () {
        return this.bossBattle;
    };

    this.goToBossBattle = function () {
        this.bossBattle = true;
    };

    this.leaveBossBattle = function () {
        this.bossBattle = false;
    };

    this.couldFightBossBattle = function () {
        return player.stage_battle_num === data.getRandomBattleCount();
    };

    this.getBg = function () {
        return data.bg;
    };
    this.getIcon = function () {
        return data.icon;
    };
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
    this.getRandomEnemiesData = function () {
        var enemies = [];
        var count = this.getRandomEnemyCount();
        for (var i = 0; i < count; i++) {
            enemies.push(this.getRandomEnemyData());
        }
        return enemies;
    };
    this.getBossData = function () {
        var enemys = [];
        var count = data.bossBattle.length;
        for (var i = 0; i < count; i++) {
            enemys.push(new Enemy(data.bossBattle[i]));
        }
        return enemys;
    };
    this.getBossTimeMax = function () {
        return /*data.bossTime*/30;
    };

};
