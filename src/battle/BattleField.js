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
            if (!sprite.isDead() && sprite.ready) {
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
            if (!sprite.isDead() && sprite.ready) {
                return sprite;
            }
        }
        return undefined;
    };
    this.findRandomAlive = function () {
        var temp = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead() && sprite.ready) {
                temp.push(sprite);
            }
        }
        if (temp.length > 0) {
            var rand = Math.round(Math.random() * (temp.length - 1));
            return temp[rand];
        }
        return undefined;
    };
    this.isAllUnitsDead = function () {
        var deadHeroNum = 0;
        for (var i in sprites) {
            if (sprites[i].isDead()) {
                deadHeroNum++;
            }
        }
        return deadHeroNum === sprites.length;
    };

    this.pause = function () {
        for (var i in sprites) {
            sprites[i].pause();
        }
    };

    this.resume = function () {
        for (var i in sprites) {
            sprites[i].resume();
        }
    };

    this.getCenterPos = function () {
        return this._centerPos;
    };
    this.setCenterPos = function (pos) {
        this._centerPos = pos;
    };
    this.findLowestHpUnit = function () {
        var lowestHpUnit = null;
        var hp = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead() && sprite.ready) {
                // find the lowest hp ratio not the value
                var tmpHp = sprite.getLife() / sprite.getMaxLife();
                if (hp === 0 || tmpHp < hp) {
                    hp = tmpHp;
                    lowestHpUnit = sprite;
                }
            }
        }
        return lowestHpUnit;
    };
};

var BattleField = cc.Class.extend({

    ctor: function (node) {
        this.container = node;
        this.heroUnits = new SpriteGroup();
        this.enemyUnits = new SpriteGroup();
        this.background = new cc.Sprite();
        this.background.setAnchorPoint(cc.p(0, 0));
        this.arenaBattle = false;
        // add the background layer
        this.container.addChild(this.background);

        bindTouchEventListener(function (touch) {
            //cc.log("点中tap");
            var pos = this.container.convertTouchToNodeSpace(touch);
            this.onPlayerTap(pos);
            return true;
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
        customEventHelper.bindListener(EVENT.SCALE_BATTLE_FIELD, function () {
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
                this.addHeroIntoBattle(hero);
            }
        }.bind(this));
        customEventHelper.bindListener(EVENT.CAST_SKILL, function (event) {
            var activeSkill;
            var data = event.getUserData();
            if(this.arenaBattle){
                activeSkill = new ActiveSkill(data.id,data.skill, this);
            }else{
                activeSkill = new ActiveSkill(player,data, this);
            }
            activeSkill.cast(this.container);
        }.bind(this));
        customEventHelper.bindListener(EVENT.USE_GAME_ITEMS, function (event) {
            this.useItem(event.getUserData());
        }.bind(this));


        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            if (!PlayerData.getStageData().isBossBattle()) {
                PlayerData.getStageData().goToBossBattle();
                this.prepareBattle(PlayerData.getStageData());
            }
        }.bind(this));
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            PlayerData.getStageData().leaveBossBattle();
            this.prepareBattle(PlayerData.getStageData());
        }.bind(this));

        customEventHelper.bindListener(EVENT.PAUSE_THE_BATTLE, function () {
            this.pauseAllSprites();
        }.bind(this));
        customEventHelper.bindListener(EVENT.RESUME_THE_BATTLE, function () {
            this.resumeAllSprites();
        }.bind(this));

        customEventHelper.bindListener(EVENT.FIGHT_ARENA_BATTLE, function(event){
            this.arenaBattle = true;
            Network.initArenaBattle(this,event.getUserData());
        }.bind(this));

        customEventHelper.bindListener(EVENT.HERO_REVIVE, this.onHeroRecover);
        customEventHelper.bindListener(EVENT.HERO_DIE, this.onHeroDead);
        customEventHelper.bindListener(EVENT.CAST_SKILL, this.onCastSkill);
    },

    pauseAllSprites: function () {
        this.container.pause();
        this.heroUnits.pause();
        this.enemyUnits.pause();
    },

    resumeAllSprites: function () {
        this.container.resume();
        this.heroUnits.resume();
        this.enemyUnits.resume();
    },

    useItem: function (item) {
        if (item.id === ITEM.small_hp_potion) {
            this.healTargets(this.findItemTargets(item), 100);
        } else if (item.id === ITEM.medium_hp_potion) {
            this.healTargets(this.findItemTargets(item), 500);
        } else if (item.id === ITEM.large_hp_potion) {
            this.healTargets(this.findItemTargets(item), 2000);
        }
    },

    healTargets: function (targets, val) {
        for (var i in targets) {
            targets[i].doDamage(-val);
        }
    },

    findItemTargets: function (item) {
        var targets = [];
        if (item.id === ITEM.small_hp_potion || item.id === ITEM.medium_hp_potion || item.id === ITEM.large_hp_potion) {
            var target = this.heroUnits.findLowestHpUnit();
            if (target) {
                targets.push(target);
            }
        }
        return targets;
    },

    initSpritesPositions: function (spritesLayer) {
        //initBattle heroes sprites positions
        this.heroPos = [];
        var MAX_POS = 8;
        var i = 0;
        for (i = 1; i < MAX_POS; i++) {
            this.heroPos[i - 1] = spritesLayer.getChildByName('hero' + i);
        }
        this.heroUnits.setCenterPos(spritesLayer.getChildByName('hero_center').getPosition());

        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (i = 1; i < MAX_POS; i++) {
            this.enemyPos[i - 1] = spritesLayer.getChildByName('enemy' + i);
        }
        this.enemyUnits.setCenterPos(spritesLayer.getChildByName('enemy_center').getPosition());
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
            var tapSkill = new TapSkill(this, target);
            tapSkill.cast(pos);
            player.statistics.total_tap++;
        }
    }
    ,
    updateEnemyLife: function () {
        var max = this.enemyUnits.getMaxLife();
        var life = Math.floor(this.enemyUnits.getLife());
        customEventHelper.sendEvent(EVENT.UPDATE_ENEMY_LIFE, {max: max, life: life});
    },

    initBattleHeroes: function () {
        var heroes = PlayerData.getHeroes();
        //暂定竞技battle 只加载第一个英雄
        if(this.arenaBattle){
            this.heroUnits.clear();
            this.addHeroIntoBattle(new Hero(heroes[0]));
        }else{
            for (var i in heroes) {
                if (heroes[i].getLv() > 0) {
                    this.addHeroIntoBattle(PlayerData.getHeroById(heroes[i].getId()));
                }
            }
        }
    },

    isAllHeroesDead: function () {
        return this.heroUnits.isAllUnitsDead();
    },

    totalSprites: 0,

    addSprite: function (sprite, zorder) {
        var order = 0;
        if (zorder) {
            order = zorder;
        } else {
            this.totalSprites++;
            order = this.totalSprites;
        }
        this.container.addChild(sprite, order * CONSTS.MAX_ATTACHMENTS_ON_SPRITE);
    },

    addSprites: function (sprites, zorder) {
        for (var i in sprites) {
            this.addSprite(sprites[i], zorder);
        }
    },

    addSpriteRelatedNode: function (sprite, node, offset) {
        var pos = sprite.getPosition();
        var pos_offset = node.getPosition();
        node.setPosition(cc.p(pos.x + pos_offset.x, pos.y + pos_offset.y));
        this.container.addChild(node, sprite.getLocalZOrder() + offset);
    },

    addSpriteRelatedNodes: function (sprite, nodes, offset) {
        for (var i in nodes) {
            this.addSpriteRelatedNode(sprite, nodes[i], offset);
        }
    },

    /**
     * 已经占据了位置的英雄数量
     */
    standHeroPosNum: 0,

    addHeroIntoBattle: function (data) {
        //var data = PlayerData.getHeroById(id);
        var hero ;
        if(this.arenaBattle){
            hero = new ArenaHeroUnit(this, player);
            this.heroUnits.push(hero);
        }else{
            hero = new HeroUnit(this, data);
            this.heroUnits.push(hero);
        }

        hero.setPosition(this.heroPos[this.standHeroPosNum].getPosition());
        // 每个精灵node位置的tag当成zorder使用
        this.addSprite(hero, this.heroPos[this.standHeroPosNum].getTag());
        hero.ready = true;
        this.standHeroPosNum++;
    },

    initBattleEnemies: function (stage) {
        var enemiesData;
        if (stage.isBossBattle()) {
            enemiesData = stage.getBossData();
        } else {
            enemiesData = stage.getRandomEnemiesData();
        }
        this.addEnemyIntoBattle(enemiesData, stage.isBossBattle());
    },

    addEnemyIntoBattle: function (enemiesData, bossBattle) {
        this.enemyUnits.clear();
        for (var i = 0; i < enemiesData.length; i++) {
            var data = enemiesData[i];
            if(this.arenaBattle){
                var enemy = new ArenaHeroUnit(this, data);
            }else{
                var enemy = new EnemyUnit(this, data);
                if (bossBattle) {
                    enemy.setScale(-1.5, 1.5);
                }
            }
            enemy.setName('enemy');
            this.enemyUnits.push(enemy);
            var startPos = cc.p(this.container.width, this.container.height * 3 / 4);
            enemy.setPosition(startPos);
            this.addSprite(enemy, this.enemyPos[i].getTag());
            enemy.runAction(cc.sequence(cc.jumpTo(0.4, this.enemyPos[i].getPosition(), 64, 1), cc.jumpBy(0.4, cc.p(0, 0), 16, 2), cc.callFunc(function () {
                this.ready = true;
            }, enemy)));
        }
    },

    findNextEnemy: function () {
        return this.enemyUnits.findFirstAlive();
    },

    getAllEnemies: function () {
        return this.enemyUnits;
    },

    getAllHeroes: function () {
        return this.heroUnits;
    },

    findRandomHero: function (playerId) {
        if(this.arenaBattle){
            if(player.id != playerId){
                return this.enemyUnits.findRandomAlive();
            }
        }
        return this.heroUnits.findRandomAlive();
    },

    checkBattleWin: function () {
        return !this.enemyUnits.findFirstAlive();
    },

    checkPlayerLost: function () {
        return !this.heroUnits.findFirstAlive();
    },

    foreachHeroSprite: function (callback) {
        this.heroUnits.foreach(callback);
    },

    initBattle: function (stage) {
        this.loadStageBackground(stage);
        this.initBattleHeroes();
        this.prepareBattle(stage);
    },

    initArenaBattle: function(challengedPlayer){
        this.initBattleHeroes();
        this.initBattleArenaChallenged(challengedPlayer);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
        PlayerData.updateIntoBattleTime();
    },
    initBattleArenaChallenged: function(challengedPlayer){
        //暂定竞技battle 只加载第一个英雄
        this.addEnemyIntoBattle([challengedPlayer]);
    },
    notifyUpdateTopPanelStageState: function () {
        customEventHelper.sendEvent(EVENT.BATTLE_START,this.arenaBattle);
    },

    onBattleWin: function () {
        var stageData = PlayerData.getStageData();
        if (stageData.isBossBattle()) {
            stageData.leaveBossBattle();
            customEventHelper.sendEvent(EVENT.WIN_BOSS_BATTLE);
            this.generateStageLoots(stageData.getBonus());
            player.stage_battle_num = 1;
            stageData.goToNextStage();
            player.stage = stageData.getId();
            player.statistics.total_max_level += 1;
            //更新通关数据
            Network.updateLeaderBoardScore(player.statistics.total_max_level, "stage_rank");
            this.loadStageBackground(stageData);
        } else {
            player.stage_battle_num += 1;
            if (stageData.couldFightBossBattle()) {
                PlayerData.getStageData().goToBossBattle();
                customEventHelper.sendEvent(EVENT.FIGHT_BOSS_BATTLE);
            }
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
        }.bind(this), 1);
        Network.updateLeaderBoardScore(player.statistics.total_gold, "gold_rank");
        PlayerData.updatePlayer();
    },

    STAGE_LOOTS_ZORDER_OFFSET: 1000,

    generateStageLoots: function (bonus) {
        var pos = cc.p(this.container.getContentSize().width * 3 / 5, this.container.getContentSize().height / 2);
        for (var i in bonus) {
            this.addSprites(Loot.generateLoots(bonus[i], pos), this.STAGE_LOOTS_ZORDER_OFFSET);
        }
        customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 3);
    },

    prepareBattle: function (stage) {
        unschedule(this);
        this.initBattleEnemies(stage);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
        PlayerData.updateIntoBattleTime();
    },

    showFairy: function () {
        var fairy = new FairyUnit(this);
        this.addSprite(fairy, CONSTS.FAIRY_SPECIFIC_ZORDER);
    },
    onHeroDead: function (hero) {
        //this.menus.skill.onHeroDead(hero);
        //cc.log("dead:" + hero);
    },

    onHeroRecover: function (hero) {
        //this.menus.skill.onHeroRecover(hero);
        //cc.log("recover:" + hero);
    },
    onCastSkill: function (i) {

    },
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
    }
});

var BATTLE_TIPS = {
    START_BOSS_BATTLE: "开始挑战Boss关卡",
    BOSS_BATTLE_FAIL: "Boss关卡挑战失败",
    BOSS_BATTLE_VICTORY: "Boss关卡挑战成功"
};