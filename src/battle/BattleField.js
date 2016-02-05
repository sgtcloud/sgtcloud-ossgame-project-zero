/**
 * Created by highkay on 2016/2/2.
 */
var SpriteGroup = function (_sprites) {
    var sprites = _sprites || [];

    this.get = function (i) {
        return sprites[i];
    };
    this.count = function () {
        return sprites.length;
    };
    this.getAllLived = function () {
        var livedSprites = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                livedSprites.push(sprite);
            }
        }
        return livedSprites;
    };
    this.foreach = function (callback, context) {
        for (var i in sprites) {
            callback.call(context, sprites[i], i);
        }
    };
    this.push = function (sprite) {
        sprites.push(sprite);
    };
    this.clear = function () {
        while (sprites.length > 0) {
            sprites[0].onClear();
            sprites.splice(0, 1);
        }
    };
    //精灵组的生命值 显示怪物总血量
    this.getLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                val += sprite.getLife();
            }
        }
        return val;
    };
    //精灵组的最大生命值 显示怪物总血量
    this.getMaxLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            val += sprite.getMaxLife();
        }
        return val;
    };
    //重置所有的精灵
    this.resetSprites = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            sprite.reset();
        }
    };
    this.findFirstAlive = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                return sprite;
            }
        }
        return undefined;
    };
    this.findRandomAlive = function () {
        var temp = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                temp.push(sprite);
            }
        }
        if (temp.length > 0) {
            var rand = Math.round(Math.random() * (temp.length - 1));
            return temp[rand];
        }
        return undefined;
    }
};

var BattleField = cc.Class.extend({

    ctor: function (node) {
        this.container = node;
        this.heroSprites = new SpriteGroup();
        this.enemySprites = new SpriteGroup();
        this.background = new cc.Sprite();
        this.background.setAnchorPoint(cc.p(0, 0));

        // add the background layer
        this.container.addChild(this.background);

        bindMouseEventListener(function (touch) {
            //cc.log("点中tap");
            var pos = this.container.convertTouchToNodeSpace(touch);
            this.onPlayerTap(pos);
            return false;
        }.bind(this), this.container);

        customEventHelper.bindListener(EVENT.SHOCK_BATTLE_FIELD, function (event) {
            var duration = event.getUserData();
            var shockActions = [];
            for (var i = 0; i < duration; i++) {
                var offsetX = Math.random() * 32 - 16;
                var offsetY = Math.random() * 32 - 16;
                var shock = cc.moveBy(0.03, cc.p(offsetX, offsetY));
                var shockReverse = cc.moveBy(0.06, cc.p(offsetX * -2, offsetY * -2));
                shockActions.push(shock);
                shockActions.push(shockReverse);
                shockActions.push(shock.clone());
            }
            this.runAction(cc.sequence(shockActions));
        }.bind(this.container));
        customEventHelper.bindListener(EVENT.SCALE_BATTLE_FIELD, function (event) {
            var scale1 = cc.scaleTo(0.1, 1.05);
            var scale1Back = cc.scaleTo(0.15, 1.0);
            var scale2 = cc.scaleTo(0.05, 1.025);
            var scale2Back = cc.scaleTo(0.075, 1.0);
            this.runAction(cc.sequence(scale1, scale1Back, scale2, scale2Back));
        }.bind(this.container));
        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            var heroId = event.getUserData().heroId;
            var hero = PlayerData.getHeroById(heroId);
            if (hero.getLv() == 1) {
                this.addHeroIntoBattle(heroId);
            }
        }.bind(this));
        customEventHelper.bindListener(EVENT.CAST_SKILL, function (event) {
            var activeSkill = new ActiveSkill(event.getUserData(), this);
            activeSkill.cast(this.container);
        }.bind(this));
    },

    initSpritesPositions: function (spritesLayer) {
        //initBattle heroes sprites positions
        this.heroPos = [];

        for (var i = 0; i < 7; i++) {
            this.heroPos[i] = this.container.convertToNodeSpace(spritesLayer.getChildByName('hero' + (i + 1)).getPosition());
        }

        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (var i = 0; i < 7; i++) {
            this.enemyPos[i] = this.container.convertToNodeSpace(spritesLayer.getChildByName('enemy' + (i + 1)).getPosition());
        }
    },

    loadStageBackground: function (stage) {
        var bg_image_url = stage.getBg();
        this.background.setTexture("res/stages/" + bg_image_url);
        //cc.textureCache.addImageAsync("res/stages/" + bg_image_url, function (textureBg) {
        //    if (textureBg) {
        //        this.background.setTexture(textureBg);
        //    }
        //}.bind(this), this.container);
    },

    onPlayerTap: function (pos) {
        var target = this.findNextEnemy();
        if (target) {
            var tapSkill = new TapSkill();
            tapSkill.cast(this.container, target, pos);
            player.statistics.total_tap++;
        }
    }
    ,
    updateEnemyLife: function () {
        var max = this.enemySprites.getMaxLife();
        var life = Math.floor(this.enemySprites.getLife());
        customEventHelper.sendEvent(EVENT.UPDATE_ENEMY_LIFE, {max: max, life: life});
    },

    initBattleHeroes: function () {
        for (var i in PlayerData.getHeroes()) {
            if (PlayerData.getHeroes()[i].getLv() > 0) {
                this.addHeroIntoBattle(PlayerData.getHeroes()[i].getId());
            }
        }
    },

    totalSprites: 0,

    addSprite: function (sprite, zorder) {
        this.totalSprites++;
        this.container.addChild(sprite, 1000 + this.totalSprites + zorder);
    },

    /**
     * 已经占据了位置的英雄数量
     */
    standHeroPosNum: 0,

    addHeroIntoBattle: function (id) {
        var data = PlayerData.getHeroById(id);
        var hero = new HeroUnit(this, data);
        this.heroSprites.push(hero);
        hero.setPosition(this.heroPos[this.standHeroPosNum]);
        this.addSprite(hero);
        this.standHeroPosNum++;
    },

    initBattleEnemies: function (stage) {
        this.enemySprites.clear();
        var enemiesData;
        if (stage.isBossBattle()) {
            enemiesData = stage.getBossData();
        } else {
            enemiesData = stage.getRandomEnemiesData();
        }

        for (var i = 0; i < enemiesData.length; i++) {
            var data = enemiesData[i];
            var enemy = new EnemyUnit(this, data);
            if (stage.isBossBattle()) {
                enemy.setScale(1.5);
            }
            this.enemySprites.push(enemy);
            var startPos = cc.p(this.container.x + this.container.width, this.container.y + this.container.height * 3 / 4);
            enemy.setPosition(startPos);
            this.addSprite(enemy, enemiesData.length - i);
            enemy.runAction(cc.sequence(cc.jumpTo(0.4, this.enemyPos[i], 64, 1), cc.jumpBy(0.4, cc.p(0, 0), 16, 2)));
        }
    },

    findNextEnemy: function () {
        return this.enemySprites.findFirstAlive();
    },

    getAllEnemies: function () {
        return this.enemySprites;
    },

    getAllHeroes: function () {
        return this.heroSprites;
    },

    findRandomHero: function () {
        return this.heroSprites.findRandomAlive();
    },

    checkBattleWin: function () {
        return !this.enemySprites.findFirstAlive();
    },

    checkPlayerLost: function () {
        return !this.heroSprites.findFirstAlive();
    },

    foreachHeroSprite: function (callback) {
        this.heroSprites.foreach(callback);
    },

    initBattle: function (stage) {
        this.loadStageBackground(stage);
        this.initBattleHeroes();
        this.prepareBattle(stage);
    },

    notifyUpdateTopPanelStageState: function () {
        customEventHelper.sendEvent(EVENT.BATTLE_START);
    },

    onBattleWin: function () {
        var stageData = PlayerData.getStageData();
        if (stageData.isBossBattle()) {
            this.generateStageLoots(stageData.getBonus());
            stageData.leaveBossBattle();
            player.stage_battle_num = 1;
            stageData.goToNextStage();
            player.stage = stageData.getId();
            player.statistics.total_max_level += 1;
            //更新通关数据
            PlayerData.updateLeaderBoardScore(player.statistics.total_max_level, "stage_rank");
            this.loadStageBackground(stageData);
        } else {
            if (stageData.couldFightBossBattle()) {
                stageData.goToBossBattle();
            }
            player.stage_battle_num += 1;
        }
        /* if (this.times != undefined) {
         clearInterval(this.times);
         }*/
        // wait for 1 second to start next battle
        //this.scheduleOnce(function () {
        //    this.prepareBattle(stageData);
        //}, 1.0);
        scheduleOnce(this, function () {
            this.prepareBattle(stageData);
            unschedule(this);
        }.bind(this), 1);
        PlayerData.updatePlayer();
    },

    generateStageLoots: function (bonus) {
        var pos = cc.p(this.x + this.width * 3 / 5, this.y + this.height * 3 / 5);
        for (var i in bonus) {
            Loot.generateLoots(bonus[i], pos);
        }
        customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 3);
    },

    prepareBattle: function (stage) {
        this.initBattleEnemies(stage);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
        PlayerData.updateIntoBattleTime();
    },

    showFairy: function () {
        var fairy = new FairyUnit();
        this.addSprite(fairy, 2010);
    },

    showChest: function (position) {
        var chest = new ChestUnit();
        chest.setPosition(position);
        this.addSprite(chest, 2011);
    },
    //todo refactor to event
    onHeroDead: function (hero) {
        //this.menus.skill.onHeroDead(hero);
        //cc.log("dead:" + hero);
    },
    //todo refactor to event
    onHeroRecover: function (hero) {
        //this.menus.skill.onHeroRecover(hero);
        //cc.log("recover:" + hero);
    },
    //todo refactor to event
    onUseSkill: function (i) {

    },
    //todo refactor to event
    onEnemyDead: function (enemy) {
        if (PlayerData.getStageData().isBossBattle()) {
            player.statistics.total_boss_kill++;
        } else {
            player.statistics.total_enemy_kill++;
        }
        var win = this.checkBattleWin();
        if (win) {
            this.onBattleWin();
        }
    },

    onEnemyVanish: function (enemy) {

    },
})