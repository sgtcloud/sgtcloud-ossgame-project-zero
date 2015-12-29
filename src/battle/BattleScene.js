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

var TopPanel = cc.Node.extend({

    ctor: function () {
        this._super();

        // load ccui gui
        var layer = ccs.csLoader.createNode(res.title_layer_json);
        this.addChild(layer);

        var root = layer.getChildByName('root');
        var pane = root.getChildByName('box');
        this.playerDiamondText = pane.getChildByName('gold_text');
        this.playerRelicText = pane.getChildByName('relic_text');
        this.battleNumText = root.getChildByName('level_text');
        this.fightBossBtn = root.getChildByName('fight_btn');
        this.leaveBossBtn = root.getChildByName('live_btn');
        this.stageNumText_bg = root.getChildByName('levelText_bg');
        this.stage_icon = root.getChildByName('stage_icon');
        var stageListRoot = root.getChildByName('enemyList').getChildByName('root');
        this.prev_stage_icon = stageListRoot.getChildByName("enemy_icon1");
        this.prev_stage_arrow = stageListRoot.getChildByName("star1");
        this.current_stage_icon = stageListRoot.getChildByName("enemy_icon2");
        this.next_stage_icon = stageListRoot.getChildByName("enemy_icon3");
        this.prev_stage_num = stageListRoot.getChildByName("level_text1");
        this.current_stage_num = stageListRoot.getChildByName("level_text2");
        this.next_stage_num = stageListRoot.getChildByName("level_text3");
        this.state = TopPanel.STATE_NORMAL_BATTLE;

        var self = this;
        // register battle custom event
        customEventHelper.bindListener(EVENT.BATTLE_START, function (event) {
            self.refreshStageState(event.getUserData(), player.stage_battle_num, PlayerData.getStageData().getRandomBattleCount());
            self.refreshStageList();
        });

        bindButtonCallback(this.fightBossBtn, function () {
            customEventHelper.sendEvent(EVENT.FIGHT_BOSS_BATTLE);
        });
        bindButtonCallback(this.leaveBossBtn, function () {
            customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
        });


        this.refreshPlayerDiamondText = function () {
            this.playerDiamondText.setString(player.gem);
        };
        this.refreshPlayerRelicText = function () {
            this.playerRelicText.setString(player.relic);
        };
        this.refreshStageState = function (bossBattle, cur, max) {

            // 根据当前stage的battle状态设置gui状态
            if (bossBattle) {
                this.state = BATTLE_STATE.STATE_BOSS_BATTLE;
            } else {
                if (cur > max) {
                    this.state = BATTLE_STATE.STATE_BOSS_READY;
                } else {
                    this.state = BATTLE_STATE.STATE_NORMAL_BATTLE;
                }
            }
            // 根据gui状态控制各个控件的可见性
            if (this.state === BATTLE_STATE.STATE_NORMAL_BATTLE) {
                this.battleNumText.setString(cur + '/' + max);
                this.leaveBossBtn.setVisible(false);
                this.fightBossBtn.setVisible(false);
                this.battleNumText.setVisible(true);
                this.stageNumText_bg.setVisible(true);
                this.stage_icon.setVisible(true);
            } else if (this.state === BATTLE_STATE.STATE_BOSS_BATTLE) {
                this.leaveBossBtn.setVisible(true);
                this.fightBossBtn.setVisible(false);
                this.battleNumText.setVisible(false);
                this.stageNumText_bg.setVisible(false);
                this.stage_icon.setVisible(false);
            } else if (this.state === BATTLE_STATE.STATE_BOSS_READY) {
                this.leaveBossBtn.setVisible(false);
                this.fightBossBtn.setVisible(true);
                this.battleNumText.setVisible(false);
                this.stageNumText_bg.setVisible(false);
                this.stage_icon.setVisible(false);
            }
        };
        this.refreshStageList = function () {
            var preStageId = PlayerData.getStageData().getPrevStageId();
            if (preStageId) {
                var preStage = new Stage(preStageId);
                this.loadStageIcon(preStage, this.prev_stage_icon);
                this.prev_stage_num.setString(preStage.getStageNum());
                this.prev_stage_arrow.setVisible(true);
            } else {
                this.prev_stage_arrow.setVisible(false);
            }
            this.loadStageIcon(PlayerData.getStageData(), this.current_stage_icon);
            this.current_stage_num.setString(PlayerData.getStageData().getStageNum());
            var nextStageId = PlayerData.getStageData().getNextStageId();
            if (nextStageId) {
                var nextStage = new Stage(nextStageId);
                this.loadStageIcon(nextStage, this.next_stage_icon);
                this.next_stage_num.setString(nextStage.getStageNum());
            }
        };
        this.loadStageIcon = function (stage, stageIconWidget) {
            var icon_image_url = "res/stages/" + stage.getIcon();
            stageIconWidget.loadTexture(icon_image_url, ccui.Widget.LOCAL_TEXTURE);
        };

        this.refreshAll = function () {
            var stage = PlayerData.getStageData();
            var cur = player.stage_battle_num;
            var max = stage.getRandomBattleCount();
            this.refreshPlayerDiamondText();
            this.refreshPlayerRelicText();
            this.refreshStageState();
            this.refreshStageList();
        };
    }
});

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
        this.addChild(battleLayer);


        var root = battleLayer.getChildByName('root');
        this.enemyLifeText = root.getChildByName('enemy_life_text');
        this.enemyLifeBar = root.getChildByName('enemy_life_bar');


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

        this.bindPlayerTapEvent = function () {
            var tap = root.getChildByName('tap');
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var pos = event.getLocation(); //当前事件发生的光标位置
                    pos.y -= 120;
                    var target = event.getCurrentTarget(); //事件绑定的目标
                    //判断当前事件发生的位置是否在事件目标区域内
                    if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                        // cc.log("Mouse Down");
                        // console.log(self);
                        self.onPlayerTap();
                        return true;
                    }
                    return false;
                },
                onMouseUp: function (event) {
                    var pos = event.getLocation();
                    pos.y -= 120;
                    var target = event.getCurrentTarget();
                    if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                        // cc.log("Mouse up");
                        return true;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listener, tap);
        };

        this.spritesLayer = root.getChildByName('sprites');
        //initBattle heroes sprites positions
        this.heroPos = [];

        for (var i = 0; i < 7; i++) {
            this.heroPos[i] = this.spritesLayer.getChildByName('hero' + (i + 1));
        }
        this.setHeroSprite = function (hero, index) {
            this.heroPos[index].addChild(hero);
        };


        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (var i = 0; i < 5; i++) {
            this.enemyPos[i] = this.spritesLayer.getChildByName('enemy' + (i + 1));
        }
        this.setEnemySprite = function (enemy, index) {
            this.enemyPos[index].addChild(enemy);
        };

        this.bossBattle = false;
        var self = this;
        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            self.bossBattle = true;
            self.prepareBattle(PlayerData.getStageData());
        });
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            self.bossBattle = false;
            self.prepareBattle(PlayerData.getStageData());
        });
        this.bindPlayerTapEvent();
        DamageNumber.initPool();
    },


    updateEnemyLife: function () {
        var max = this.enemySprites.getMaxLife();
        var life = this.enemySprites.getLife();
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
            this.setHeroSprite(hero, i);
        }
    },

    initBattleEnemies: function (stage) {
        this.enemySprites.clear();
        var enemiesData;
        if (this.bossBattle) {
            enemiesData = stage.getBossData();
        } else {
            enemiesData = stage.getRandomEnemiesData();
        }

        for (var i = 0; i < enemiesData.length; i++) {
            var data = enemiesData[i];
            var enemy = new EnemyUnit(this, data);
            this.enemySprites.push(enemy);
            this.setEnemySprite(enemy, i);
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
        this.prepareBattle(stage);
    },

    notifyUpdateTopPanelStageState: function () {
        customEventHelper.sendEvent(EVENT.BATTLE_START, this.bossBattle)
    },

    onBattleWin: function () {
        if (this.bossBattle) {
            this.bossBattle = false;
            player.stage_battle_num = 1;
            PlayerData.getStageData().goToNext();
            player.stage = PlayerData.getStageData().getId();
            this.loadStageBackground(PlayerData.getStageData());
        } else {
            if (this.couldFightBossBattle()) {
                this.bossBattle = true;
            } else {
                this.bossBattle = false;
            }
            player.stage_battle_num += 1;
        }
        this.prepareBattle(PlayerData.getStageData());
        PlayerData.updatePlayer();
    },

    prepareBattle: function (stage) {
        this.initBattleEnemies(stage);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
    },

    onHeroDead: function (hero) {
        //this.menus.skill.onHeroDead(hero);
    },
    onHeroRecover: function (hero) {
        //this.menus.skill.onHeroRecover(hero);
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

    couldFightBossBattle: function () {
        return player.stage_battle_num === PlayerData.getStageData().getRandomBattleCount();
    },

});


var TabContainer = cc.Node.extend({

    ctor: function (battlePanel) {
        this._super();

        this.menuLayer = ccs.csLoader.createNode(res.menu_layer_json);
        this.addChild(this.menuLayer);

        // for measure the container height
        this.height = this.menuLayer.height;
        var root = this.menuLayer.getChildByName('root');
        var menuParams = [
            {name: "main", click: "onMainClick"},
            {name: "hero", click: "onHeroClick"},
            {name: "equip", click: "onEquipClick"},
            {name: "pvp", click: "onPvpClick"},
            {name: "rank", click: "onRankClick"},
            {name: "shop", click: "onShopClick"},
        ];
        this.buttons = {};

        var self = this;
        for (var i in menuParams) {
            var param = menuParams[i];
            var name = param.name;
            var click = param.click;
            this.buttons[name] = root.getChildByName(name);
            this.buttons[name].setSelected(false);
            this.buttons[name].addEventListener(function (sender, type) {
                console.log(sender);
                if (type === ccui.CheckBox.EVENT_SELECTED) {
                    self.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }, this);

        }

        this.menus = {};
        this.menus.main = new SkillListMenu(battlePanel);
        this.menus.hero = new HeroListMenu(battlePanel);
        this.menus.equip = new EquipListMenu(battlePanel);


        for (var i in this.menus) {
            this.menus[i].setPosition(0, this.menuLayer.height);
            this.menuLayer.addChild(this.menus[i]);
            this.menus[i].setVisible(false);
        }
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            for (var i in this.menus) {
                this.menus[i].setVisible(false);
            }

            this.menus[name].setVisible(true);

            this.buttons[name].setSelected(true);

            //console.log(this.menuButtons);
        };

        //for (var i in this.menuButtons) {
        //	this.menuButtons[i].setEnabled(false);
        //}
        this.updatePlayerGoldText = function () {
            //for (var i in this.menuLayers) {
            //    this.menuLayers[i].updatePlayerGoldText();
            //}
        }
    }
});


var MainScene = cc.Scene.extend({

    onEnter: function () {
        this._super();

        this.battlePanel = new BattlePanel(this);

        //tab container
        this.tabContainer = new TabContainer(this.battlePanel);
        this.tabContainer.setPosition(0, 0);
        this.addChild(this.tabContainer, 100);
        this.tabContainer.updatePlayerGoldText();

        //battle panel
        this.battlePanel.setPosition(0, this.tabContainer.height);
        this.addChild(this.battlePanel);

        //top panel
        this.topPanel = new TopPanel(this);
        this.topPanel.setPosition(0, this.tabContainer.height + this.battlePanel.height);
        this.addChild(this.topPanel);
        this.topPanel.refreshAll();

        this.tabContainer.showMenuLayer('main');

        this.battlePanel.initBattle(PlayerData.getStageData());

    }
});
