/**
 * BattleUnitGroup是英雄和敌人的容器类，包装精灵数组的系列逻辑
 *
 * @param _sprites
 * @constructor
 */
var BattleUnitGroup = function (_sprites) {
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
/**
 * 战斗的核心类，战场，是所有战斗内对象的逻辑父容器
 *
 * @type {Function}
 */
var BattleField = cc.Class.extend({

    ctor: function (node) {
        //this._super();
        /**
         * view容器
         */
        this.container = node;
        /**
         * 英雄容器
         * @type {BattleUnitGroup}
         */
        this.heroUnits = new BattleUnitGroup();
        /**
         * 敌人容器/竞技场对手容器
         * @type {BattleUnitGroup}
         */
        this.enemyUnits = new BattleUnitGroup();
        this.background = new cc.Sprite();
        this.background.setAnchorPoint(cc.p(0, 0));
        this.arenaBattle = false;
        // add the background layer
        this.container.addChild(this.background);

        bindTouchEventListener(function (touch) {
            //cc.log("点中tap");
            if (!this.arenaBattle) {
                var pos = this.container.convertTouchToNodeSpace(touch);
                this.onPlayerTap(pos);
            }
            return true;
        }.bind(this), this.container);

        PlayerDataClass.prototype.getArenaBattleStatus = function(){
            return this.arenaBattle;
        }.bind(this);

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
            if (this.arenaBattle) {
                activeSkill = new ActiveSkill(data.id, data.skill, this);
            } else{
                activeSkill = new ActiveSkill(player.id, data, this);
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

        customEventHelper.bindListener(EVENT.PAUSE_THE_BATTLE, this.pauseAllSprites.bind(this));
        customEventHelper.bindListener(EVENT.RESUME_THE_BATTLE, this.resumeAllSprites.bind(this));

        customEventHelper.bindListener(EVENT.HERO_REVIVE, this.onHeroRecover.bind(this));
        customEventHelper.bindListener(EVENT.HERO_DIE, this.onHeroDead.bind(this));
        customEventHelper.bindListener(EVENT.CAST_SKILL, this.onCastSkill.bind(this));
        customEventHelper.bindListener(EVENT.FIGHT_ARENA_BATTLE, function (event) {
            tip.toggle('开始竞技');
            this.arenaBattle = true;
            this.challengedId = event.getUserData().challengeId;
            this.initArenaBattle(/*event.getUserData()*//*"8a20a23279996"*/event.getUserData().playerId);
        }.bind(this));

        /*PlayerData.prototype.getArenaPlayerData = function(playerId){
            if(this.arenaBattle){

            }else{
                return NormalPlayerData;
            }
        }.bind(this);*/

    },

    /**
     * 暂停战斗中的所有表现和逻辑
     */
    pauseAllSprites: function () {
        this.container.pause();
        this.heroUnits.pause();
        this.enemyUnits.pause();
    },

    /**
     * 恢复战斗中的所有表现和逻辑
     */
    resumeAllSprites: function () {
        this.container.resume();
        this.heroUnits.resume();
        this.enemyUnits.resume();
    },

    /**
     * 使用道具
     * @param item
     */
    useItem: function (item) {
        if (item.id === ITEM.small_hp_potion) {
            this.healTargets(this.findItemTargets(item), 100);
        } else if (item.id === ITEM.medium_hp_potion) {
            this.healTargets(this.findItemTargets(item), 500);
        } else if (item.id === ITEM.large_hp_potion) {
            this.healTargets(this.findItemTargets(item), 2000);
        }
    },

    /**
     * 治愈多个单位（英雄或者敌人）
     *
     * @param targets
     * @param val
     */
    healTargets: function (targets, val) {
        for (var i in targets) {
            targets[i].doDamage(-val);
        }
    },

    /**
     * 根据道具类型寻找作用目标单位
     *
     * @param item
     * @returns {Array}
     */
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

    /**
     * 读取ccs文件中name为sprites层中包含的精灵信息初始化英雄和敌人的位置，具体请查看gfx/HookGame/alpha.ccs中BattleLayer
     *
     * @param spritesLayer
     */
    initUnitPositions: function (spritesLayer) {
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
        spritesLayer.removeFromParent();
    },

    /**
     * 异步加载战斗场景的背景图
     * @param stage
     */
    loadStageBackground: function (stage) {
        var bg_image_url = stage.getBg();
        this.background.setTexture("res/stages/" + bg_image_url);
    },

    /**
     * 点击战斗场景触发一个特殊的主动技能，即点击伤害
     *
     * @param pos
     */
    onPlayerTap: function (pos) {
        var target = this.findNextEnemy();
        if (target) {
            var tapSkill = new TapSkill(this, target);
            tapSkill.cast(pos);
            player.statistics.total_tap++;
        }
    },

    /**
     * 更新敌人的总血量
     */
    updateEnemyLife: function () {
        var max = this.enemyUnits.getMaxLife();
        var life = Math.floor(this.enemyUnits.getLife());
        customEventHelper.sendEvent(EVENT.UPDATE_ENEMY_LIFE, {max: max, life: life});
    },

    /**
     * 从存档数据初始化战斗中的英雄，仅调用一次。如果通过解锁英雄加入战斗，需自行调用addHeroIntoBattle
     */
    initBattleHeroes: function (heroes) {
        //var heroes = PlayerData.getHeroes();
        for (var i in heroes) {
            if (heroes[i].getLv() > 0) {
                var hero = heroes[i];
                this.addHeroIntoBattle(hero);
            }
        }
    },

    isAllHeroesDead: function () {
        return this.heroUnits.isAllUnitsDead();
    },

    totalSprites: 0,

    /**
     * 把精灵单位添加到战斗中
     *
     * @param sprite
     * @param zorder
     */
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

    /**
     * 添加多个精灵单位到战斗中
     *
     * @param sprites
     * @param zorder
     */
    addSprites: function (sprites, zorder) {
        for (var i in sprites) {
            this.addSprite(sprites[i], zorder);
        }
    },

    /**
     * 根据存在的精灵单位为参照添加新精灵单位到战斗中，例如伤害数字，血条，buff图标，掉落等
     * @param sprite
     * @param node
     * @param offset
     */
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
    /**
     * 根据英雄的id来查找英雄模型添加到战斗中
     *
     * @param id
     */
    addHeroIntoBattle: function (data) {
        //var data = PlayerData.getHeroById(id);
        var hero;
        if (this.arenaBattle) {
            hero = new ArenaHeroUnit(this, data, player.id);
            this.heroUnits.push(hero);
        } else {
            hero = new HeroUnit(this, data);
            this.heroUnits.push(hero);
        }

        hero.setPosition(this.heroPos[this.standHeroPosNum].getPosition());
        // 每个精灵node位置的tag当成zorder使用
        this.addSprite(hero, this.heroPos[this.standHeroPosNum].getTag());
        hero.ready = true;
        this.standHeroPosNum++;
    },

    /**
     * 根据关卡模型数据初始化敌人单位
     * @param stage
     */
    initBattleEnemies: function (stage) {
        var enemiesData;
        if (stage.isBossBattle()) {
            enemiesData = stage.getBossData();
        } else {
            enemiesData = stage.getRandomEnemiesData();
        }
        this.addEnemyIntoBattle(enemiesData, stage.isBossBattle());
    },

    /**
     * 添加敌人精灵单位到战斗中
     *
     * @param enemiesData
     * @param bossBattle
     */
    addEnemyIntoBattle: function (enemiesData, bossBattle) {
        this.enemyUnits.clear();
        for (var i = 0; i < enemiesData.length; i++) {
            var data = enemiesData[i];
            var enemy;
            if (this.arenaBattle) {
                //var arenaHero = new ArenaHero(data);
                enemy = new ArenaHeroUnit(this, data);
            } else {
                enemy = new EnemyUnit(this, data);
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

    findRandomHero: function (/*playerId*/) {
        /*if (this.arenaBattle) {
            if (player.id == playerId) {
                return this.enemyUnits.findRandomAlive();
            }
        }*/
        return this.heroUnits.findRandomAlive();
    },
    findRandomEnemy: function () {
        return this.enemyUnits.findRandomAlive();
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
    reset: function (data) {
        this.heroUnits.clear();
        this.enemyUnits.clear();
        this.standHeroPosNum = 0;
        arenaHeroPlayerData = null;
        arenaEnemyPlayerData = null;
        delete this.challengedId;
        setTimeout(function(){
            this.initBattle(data);
        }.bind(this),2000);
    },
    /**
     * 根据关卡数据初始化战斗，仅调用一次
     * @param stage
     */
    initBattle: function (stage) {
        this.loadStageBackground(stage);
        this.initBattleHeroes(PlayerData.getHeroes());
        this.prepareBattle(stage);
    },
    /**
     * 提醒顶部面板更新关卡的状态，例如Boss战和关卡序号
     */
    initArenaBattle: function (playerId) {
        this.heroUnits.clear();
        this.enemyUnits.clear();
        this.standHeroPosNum = 0;
        this.countdown = CCSUnit.create(res.countdown_json);
        this.countdown.setPosition(320, 100);
        this.addSprite(this.countdown, 1000);
        this.countdown.playAnimation("3", false, function () {

            Network.initArenaBattle(playerId, function (result, data) {
                if (result) {
                    arenaHeroPlayerData = new ArenaPlayerData();
                    arenaHeroPlayerData.init(player);
                    arenaEnemyPlayerData = new ArenaPlayerData();
                    arenaEnemyPlayerData.init(data);
                    //this.challengedPlayer = data;
                    this.countdown.playAnimation("2", false, function () {
                        //开始战斗
                        this.initBattleHeroes(arenaHeroPlayerData.getHeroes());
                        this.initBattleArenaEnemys(arenaEnemyPlayerData);
                        this.updateEnemyLife();
                        this.notifyUpdateTopPanelStageState();
                        PlayerData.updateIntoBattleTime();
                        this.countdown.playAnimation("1", false, function () {
                            this.countdown.playAnimation('ready', false, function () {
                                this.countdown.removeFromParent();
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                } else {
                    tip.toggle('挑战异常');
                    //this.reset(PlayerData.getStageData());
                }
            }.bind(this));
        }.bind(this));
    },
    initBattleArenaEnemys: function (arenaEnemyPlayerData) {
        var arenaEnemys = arenaEnemyPlayerData.getHeroes();
        var aliveArenaEnemys = [];
        for (var i in arenaEnemys) {
            if (arenaEnemys[i].getLv() > 0) {
                var hero = arenaEnemys[i];
                aliveArenaEnemys.push(hero);
            }
        }
        this.addEnemyIntoBattle(aliveArenaEnemys);
    },
    notifyUpdateTopPanelStageState: function () {
        customEventHelper.sendEvent(EVENT.BATTLE_START, this.arenaBattle);
    },
    /**
     * 结算战斗胜利的逻辑
     */
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
        scheduleOnce(this, function () {
            this.prepareBattle(stageData);
        }.bind(this), 1);
        Network.updateLeaderBoardScore(player.statistics.total_gold, "gold_rank");
        PlayerData.updatePlayer();
    },

    STAGE_LOOTS_ZORDER_OFFSET: 1000,

    /**
     * 生成关卡掉落
     *
     * @param bonus
     */
    generateStageLoots: function (bonus) {
        var pos = this.enemyUnits.getCenterPos();
        for (var i in bonus) {
            this.addSprites(Loot.generateLoots(bonus[i], pos), this.STAGE_LOOTS_ZORDER_OFFSET);
        }
        customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 3);
    },

    /**
     * 准备战斗数据，每次战斗调用一次
     *
     * @param stage
     */
    prepareBattle: function (stage) {
        unschedule(this);
        if(!this.arenaBattle){
            this.initBattleEnemies(stage);
            this.updateEnemyLife();
            this.notifyUpdateTopPanelStageState();
            PlayerData.updateIntoBattleTime();
        }
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
        if (this.arenaBattle) {
            //如果是当前登陆角色的英雄dead 则挑战失败
            if (this.checkPlayerLost()) {
                console.log('挑战失败');
                this.arenaBattle = false;
                var challengedId = this.challengedId;
                setTimeout(function(){
                    this.reset(PlayerData.getStageData());
                    customEventHelper.sendEvent(EVENT.LOSE_ARENA_BATTLE,challengedId);
                }.bind(this),1000);
            } else if (this.checkBattleWin()) {
                console.log('挑战胜利');
                this.arenaBattle = false;
                var challengedId = this.challengedId;
                setTimeout(function(){
                    this.reset(PlayerData.getStageData());
                    customEventHelper.sendEvent(EVENT.WIN_ARENA_BATTLE,challengedId);
                }.bind(this),1000);
            }
        } else {
            if (PlayerData.getStageData().isBossBattle()) {
                player.statistics.total_boss_kill++;
            } else {
                player.statistics.total_enemy_kill++;
            }
            var win = this.checkBattleWin();
            if (win) {
                this.onBattleWin();
            }
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