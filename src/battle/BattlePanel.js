var SpriteGroup = function (_sprites) {
    var sprites = _sprites || [];

    this.get = function (i) {
        return sprites[i];
    };
    this.count = function () {
        return sprites.length;
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
            val += sprite.getLife();
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


var BATTLE_STATE = {
    STATE_NORMAL_BATTLE: 0,
    STATE_BOSS_BATTLE: 1,
    STATE_BOSS_READY: 2,
};


var BattlePanel = cc.Node.extend({

    ctor: function () {
        this._super();

        this.heroSprites = new SpriteGroup();
        this.enemySprites = new SpriteGroup();


        var battleLayer = ccs.csLoader.createNode(res.battle_layer_json);
        this.height = battleLayer.height;
        this.width = battleLayer.width;
        this.addChild(battleLayer);


        var root = battleLayer.getChildByName('root');
        this.enemyLifeText = root.getChildByName('enemy_life_text');
        this.enemyLifeBar = root.getChildByName('enemy_life_bar');
        this.timeText = root.getChildByName('time_text');
        this.icon = root.getChildByName('icon');
        this.timeBar = root.getChildByName('time_bar');

        this.rewardBtn = root.getChildByName('reward_btn');
        var self = this;
        bindButtonCallback(this.rewardBtn, function () {
            var offlineRewardLayer = ccs.csLoader.createNode(res.offline_reward_layer);

            var offlineRewardLayerRoot = offlineRewardLayer.getChildByName('root');
            var offlineRewardLayerBtn = offlineRewardLayerRoot.getChildByName('btn').getChildByName('offline_btn');

            var offlineRewardLayerBox = offlineRewardLayerRoot.getChildByName('box');
            var rewards = player.not_get_reward;
            for (var key in rewards) {
                if (rewards.hasOwnProperty(key)) {
                    var offlineRewardLayerText = offlineRewardLayerBox.getChildByName(key + '_text');
                    offlineRewardLayerText.ignoreContentAdaptWithSize(true);
                    offlineRewardLayerText.setString(rewards[key]);
                }
            }
            bindButtonCallback(offlineRewardLayerBtn, function () {
                offlineRewardLayer.removeFromParent();
                self.rewardBtn.visible = false;
                PlayerData.receiveOfflineReward();
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                PlayerData.updatePlayer();
            });
            popup(offlineRewardLayer, 1000);
        });

        var battle_bg = root.getChildByName('battle_bg');
        this.loadStageBackground = function (stage) {
            var bg_image_url = stage.getBg();
            cc.textureCache.addImageAsync("res/stages/" + bg_image_url, function (textureBg) {
                if (textureBg) {
                    battle_bg.removeAllChildren();
                    var bg = new cc.Sprite(textureBg);
                    bg.attr({
                            x: battle_bg.width / 2,
                            y: battle_bg.height / 2
                        }
                    );
                    battle_bg.addChild(bg);
                }
            }, this);
        };

        var tap = root.getChildByName('tap');
        var battleZone = tap;
        var tempEffect = ccs.load(res.tap_effect_json);
        var hitEffect = tempEffect.node;
        var hitAction = tempEffect.action;
        var hitIndex = 1;
        hitEffect.setVisible(false);
        hitEffect.runAction(hitAction);
        this.addChild(hitEffect, 1000);
        this.bindPlayerTapEvent = function () {
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown: function (touch, event) {
                    var locationInNode = battleZone.convertToNodeSpace(touch.getLocation());
                    var s = battleZone.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    var target = self.findNextEnemy();
                    if (cc.rectContainsPoint(rect, locationInNode) && target) {
                        //cc.log(locationInNode.x + " " + locationInNode.y);
                        hitEffect.setPosition(self.convertToNodeSpace(touch.getLocation()));
                        hitEffect.setVisible(true);
                        hitAction.play("boom" + hitIndex, false);
                        target.doDamage(PlayerData.getTotalHit());
                        hitIndex++;
                        if (hitIndex > 4) {
                            hitIndex = 1;
                        }
                        return true;
                    }
                    return false;
                },
            });
            cc.eventManager.addListener(listener, tap);
        };

        this.spritesLayer = root.getChildByName('sprites');
        //initBattle heroes sprites positions
        this.heroPos = [];

        for (var i = 0; i < 7; i++) {
            this.heroPos[i] = this.spritesLayer.getChildByName('hero' + (i + 1));
        }

        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (var i = 0; i < 5; i++) {
            this.enemyPos[i] = this.spritesLayer.getChildByName('enemy' + (i + 1));
        }

        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            PlayerData.getStageData().goToBossBattle();
            self.prepareBattle(PlayerData.getStageData());
        });
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            PlayerData.getStageData().leaveBossBattle();
            self.prepareBattle(PlayerData.getStageData());
            if (self.times != undefined) {
                clearInterval(self.times);
            }

        });
        customEventHelper.bindListener(EVENT.GOLD_POSITION, function (event) {
            self.goldPosition = event.getUserData();
        });
        this.bindPlayerTapEvent();
        DamageNumber.initPool();
    },

    loadRewardBtn: function () {
        if (player.not_get_reward["gold"] > 0) {
            this.rewardBtn.visible = true;
        } else {
            this.rewardBtn.visible = false;
        }
    }
    ,
    updateEnemyLife: function () {
        var max = this.enemySprites.getMaxLife();
        var life = this.enemySprites.getLife();
        this.enemyLifeText.ignoreContentAdaptWithSize(true);
        this.enemyLifeText.setString(life);
        this.enemyLifeBar.setPercent(life / max * 100);
    },

    onPlayerTap: function () {
        var target = this.findNextEnemy();
        if (target) {
            target.doDamage(PlayerData.getTotalHit());
        }
    },

    initBattleHeroes: function () {
        for (var i = 0; i < player.heroes.length; i++) {
            var data = PlayerData.getHeroesData(i);
            var hero = new HeroUnit(this, data, player.heroes[i]);
            this.heroSprites.push(hero);
            hero.setPosition(this.heroPos[i].getPosition());
            this.addChild(hero, player.heroes.length - i);
        }
    },
    disableBossBattleTimeCounter: function () {
        this.timeText.visible = false;
        this.timeBar.visible = false;
        this.icon.visible = true;
    },
    enableBossBattleTimeCounter:function(stage){
        this.timeText.visible = true;
        this.timeBar.visible = true;
        this.icon.visible = false;
        var boosTimeMax = stage.getBossTimeMax();
        var self = this;
        this.timeText.ignoreContentAdaptWithSize(true);
        this.timeText.setString(boosTimeMax);
        this.timeBar.setPercent(boosTimeMax / stage.getBossTimeMax() * 100);

        this.times = setInterval(function () {
            if (boosTimeMax == 0) {
                customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
            } else {
                boosTimeMax--;
                self.timeText.setString(boosTimeMax);
                self.timeBar.setPercent(boosTimeMax / stage.getBossTimeMax() * 100);
            }
        }, 1000);
    },
    initBattleEnemies: function (stage) {
        this.enemySprites.clear();
        var enemiesData;
        if (stage.isBossBattle()) {
            enemiesData = stage.getBossData();
            this.enableBossBattleTimeCounter(stage);
        } else {
            this.disableBossBattleTimeCounter();
            enemiesData = stage.getRandomEnemiesData();
        }

        for (var i = 0; i < enemiesData.length; i++) {
            var data = enemiesData[i];
            var enemy = new EnemyUnit(this, data);
            this.enemySprites.push(enemy);
            var startPos = cc.p(this.x + this.width, this.y + this.height * 3 / 4);
            enemy.setPosition(startPos);
            this.addChild(enemy, enemiesData.length - i);
            enemy.runAction(cc.sequence(cc.jumpTo(0.4, this.enemyPos[i].getPosition(), 64, 1), cc.jumpBy(0.4, cc.p(0, 0), 16, 2)));
        }
    },

    findNextEnemy: function () {
        return this.enemySprites.findFirstAlive();
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
        this.loadRewardBtn();
        this.prepareBattle(stage);
    },

    notifyUpdateTopPanelStageState: function () {
        customEventHelper.sendEvent(EVENT.BATTLE_START);
    },

    onBattleWin: function () {
        var stageData = PlayerData.getStageData();
        if (stageData.isBossBattle()) {
            stageData.leaveBossBattle();
            player.stage_battle_num = 1;
            stageData.goToNextStage();
            player.stage = stageData.getId();
            this.loadStageBackground(stageData);
        } else {
            if (stageData.couldFightBossBattle()) {
                stageData.goToBossBattle();
            }
            player.stage_battle_num += 1;
        }
        // wait for 1 second to start next battle
        //this.scheduleOnce(function () {
        //    this.prepareBattle(stageData);
        //}, 1.0);
        this.prepareBattle(stageData);
        PlayerData.updatePlayer();
    },

    prepareBattle: function (stage) {
        this.initBattleEnemies(stage);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
        PlayerData.updateIntoBattleTime();
    },

    onHeroDead: function (hero) {
        //this.menus.skill.onHeroDead(hero);
        cc.log("dead:" + hero);
    },
    onHeroRecover: function (hero) {
        //this.menus.skill.onHeroRecover(hero);
        cc.log("recover:" + hero);
    },
    onUseSkill: function (i) {

    },

    onEnemyDead: function (enemy) {
        PlayerData.consumeResource(enemy.getBonus());
        //this.updatePlayerGoldText();
        //this.updateTopPanel();
    },

    onEnemyVanish: function (enemy) {
        var win = this.checkBattleWin();
        if (win) {
            this.onBattleWin();
        }
    },

});
