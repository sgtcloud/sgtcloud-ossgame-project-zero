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

        this.buffList=root.getChildByName('buff_list');
        //this.buffList.setLocalZOrder(9000);


        this.timeText.setVisible(false);

        var self = this;
        this.statistics_btn = root.getChildByName("statistics_btn");
        bindButtonCallback(this.statistics_btn, function () {
            //var staticUnit = new StatisticsUnit();

            //staticUnit.ignoreAnchorPointForPosition(true);
            //popup(staticUnit,4000);
            popup(new GamePopup(new StatisticsUnit(),cc.p(320,580),false), 4000);
        });
        this.rewardBtn = root.getChildByName('reward_btn');
        this.openPopup = function () {
            var offlineRewardLayer = ccs.csLoader.createNode(res.offline_reward_layer);

            var offlineRewardLayerRoot = offlineRewardLayer.getChildByName('root');
            var offlineRewardLayerBtn = offlineRewardLayerRoot.getChildByName('btn').getChildByName('offline_btn');

            var offlineRewardLayerBox = offlineRewardLayerRoot.getChildByName('box');
            var rewards = player.not_get_reward;
            for (var key in rewards) {
                if (rewards.hasOwnProperty(key)) {
                    var tempKey = key;
                    if(key.indexOf("key") != -1){
                        var icon = offlineRewardLayerBox.getChildByName("key");
                        icon.loadTexture("res/materialUI/" + tempKey+".png");
                        key = "key";
                    }
                    var offlineRewardLayerText = offlineRewardLayerBox.getChildByName(key + '_text');
                    offlineRewardLayerText.ignoreContentAdaptWithSize(true);
                    offlineRewardLayerText.setString(rewards[tempKey]);
                }
            }
            var gamePopup = new GamePopup(offlineRewardLayer);
            //bindTouchEventListener(,);
            bindButtonCallback(offlineRewardLayerBtn,function () {
                offlineRewardLayer.removeFromParent();
                self.rewardBtn.visible = false;
                gamePopup.removeFromParent();
                PlayerData.receiveOfflineReward();
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                //customEventHelper.sendEvent(EVENT);
                PlayerData.updatePlayer();
               // return true;
            });
            popup(gamePopup, 4000);
            //gamePopup.popup();
        };
        bindButtonCallback(this.rewardBtn, function () {
            self.openPopup();
        });

        Loot.prototype.getPackPosition = function () {
            return cc.p(10, 780);
        }.bind(this);

        var pack_btn = root.getChildByName('pack_btn');
        pack_btn.setLocalZOrder(1);
        bindButtonCallback(pack_btn,function () {
            var packUnit = new PackUnit();
            var gamePopup = new GamePopup(packUnit,cc.p(320,580),false);
            popup(gamePopup,3000);
        }.bind(this));
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
        bindMouseEventListener(function (touch) {
            cc.log("点中tap");
            var pos = this.convertTouchToNodeSpace(touch);
            this.onPlayerTap(pos);
            return false;
        }.bind(this), tap);

        this.spritesLayer = root.getChildByName('sprites');
        //initBattle heroes sprites positions
        this.heroPos = [];

        for (var i = 0; i < 7; i++) {
            this.heroPos[i] = this.spritesLayer.getChildByName('hero' + (i + 1));
        }

        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (var i = 0; i < 7; i++) {
            this.enemyPos[i] = this.spritesLayer.getChildByName('enemy' + (i + 1));
        }

        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            PlayerData.getStageData().goToBossBattle();
            self.prepareBattle(PlayerData.getStageData());
        });
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            PlayerData.getStageData().leaveBossBattle();
            self.prepareBattle(PlayerData.getStageData());

        });
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
            self.runAction(cc.sequence(shockActions));
        });
        customEventHelper.bindListener(EVENT.SCALE_BATTLE_FIELD, function (event) {
            var scale1 = cc.scaleTo(0.1, 1.05);
            var scale1Back = cc.scaleTo(0.15, 1.0);
            var scale2 = cc.scaleTo(0.05, 1.025);
            var scale2Back = cc.scaleTo(0.075, 1.0);
            self.runAction(cc.sequence(scale1, scale1Back, scale2, scale2Back));
        });
        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            var heroId = event.getUserData().heroId;
            var hero = PlayerData.getHeroById(heroId);
            if (hero.getLv() == 1) {
                this.addHeroIntoBattle(heroId);
            }
        }.bind(this));
        customEventHelper.bindListener(EVENT.CAST_SKILL, function (event) {
            var activeSkill = new ActiveSkill(event.getUserData(), self);
            activeSkill.cast(this);
        }.bind(this));
        DamageNumber.initPool();

        this.update = function (dt) {
            {
                //customEventHelper.sendEvent(EVENT.TEST_BLOCK);
                if (this.intervalState) {
                    this.intervalTime += dt;
                    if (this.intervalTime > CONSTS.flySpirit_interval_time) {
                        this.showFairy();
                    }
                }
                var stage = PlayerData.getStageData();
                if (stage.isBossBattle()) {
                    this.updateBossBattleTime(dt, stage);
                }
            }
        },
            this.reset();
        this.scheduleUpdate();
    },
    reset: function () {
        this.intervalTime = 0;
        this.intervalState = true;
    },
    loadRewardBtn: function () {
        if (cc.isObject(player.not_get_reward)) {
            this.rewardBtn.visible = true;
        } else {
            this.rewardBtn.visible = false;
        }
    }
    ,
    updateEnemyLife: function () {
        var max = this.enemySprites.getMaxLife();
        var life = Math.floor(this.enemySprites.getLife());
        this.enemyLifeText.ignoreContentAdaptWithSize(true);
        this.enemyLifeText.setString(life);
        this.enemyLifeBar.setPercent(life / max * 100);
    },

    onPlayerTap: function (pos) {
        var target = this.findNextEnemy();
        if (target) {
            var tapSkill = new TapSkill();
            tapSkill.cast(this, target, pos);
            player.statistics.total_tap++;
        }
    },

    initBattleHeroes: function () {
        for (var i in PlayerData.getHeroes()) {
            if (PlayerData.getHeroes()[i].getLv() > 0) {
                this.addHeroIntoBattle(PlayerData.getHeroes()[i].getId());
            }
        }
    },

    /**
     * 已经占据了位置的英雄数量
     */
    standHeroPosNum: 0,

    addHeroIntoBattle: function (id) {
        var data = PlayerData.getHeroById(id);
        var hero = new HeroUnit(this, data);
        this.heroSprites.push(hero);
        hero.setPosition(this.heroPos[this.standHeroPosNum].getPosition());
        this.addChild(hero);
        this.standHeroPosNum++;
    },
    disableBossBattleTimeCounter: function () {
        this.timeText.visible = false;
        this.timeBar.visible = false;
        this.icon.visible = true;
    },
    enableBossBattleTimeCounter: function (stage) {
        this.timeText.visible = true;
        this.timeBar.visible = true;
        this.icon.visible = false;
        this.boosTimeMax = stage.getBossTimeMax();
        //var self = this;
        this.timeText.ignoreContentAdaptWithSize(true);
    },
    updateBossBattleTime: function (dt, stage) {
        if (Math.floor(this.boosTimeMax) < 0) {
            customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
        } else {
            this.boosTimeMax = this.boosTimeMax - dt;
            this.timeText.setString(Math.floor(this.boosTimeMax));
            this.timeBar.setPercent(Math.floor(this.boosTimeMax) / stage.getBossTimeMax() * 100);
        }
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
            if (stage.isBossBattle()) {
                enemy.setScale(1.5);
            }
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
        this.loadRewardBtn();
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
            PlayerData.updateLeaderBoardScore(player.statistics.total_max_level);
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
        this.intervalState = false;
        this.FairyUnit = new FairyUnit();
        this.addChild(this.FairyUnit, 2010);
    },
    showChest: function (position) {
        this.ChestUnit = new ChestUnit();
        this.ChestUnit.setPosition(position);
        this.addChild(this.ChestUnit, 2011);
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

});
