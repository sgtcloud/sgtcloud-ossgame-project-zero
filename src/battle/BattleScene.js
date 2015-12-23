var SpriteGroup = function (_sprites) {
    var sprites = _sprites || [];

    this.get = function (i) {
        return sprites[i];
    }
    this.count = function () {
        return sprites.length;
    }
    this.foreach = function (callback, context) {
        for (var i in sprites) {
            callback.call(context, sprites[i], i);
        }
    }
    this.push = function (sprite) {
        sprites.push(sprite);
    }
    this.clear = function () {
        while (sprites.length > 0) {
            sprites[0].onClear();
            sprites.splice(0, 1);
        }
    }
    //精灵组的生命值 显示怪物总血量
    this.getLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            val += sprite.life;
        }
        return val;
    }
    //精灵组的最大生命值 显示怪物总血量
    this.getMaxLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            val += sprite.getMaxLife();
        }
        return val;
    }
    //重置所有的精灵
    this.resetSprites = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            sprite.reset();
        }
    }
    this.findFirstAlive = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            if (sprite.life > 0) {
                return sprite;
            }
        }
        return undefined;
    }
    this.findRandomAlive = function () {
        var temp = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (sprite.life > 0) {
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
        this.current_stage_icon = stageListRoot.getChildByName("enemy_icon2");
        this.next_stage_icon = stageListRoot.getChildByName("enemy_icon3");
        this.prev_stage_num = stageListRoot.getChildByName("level_txt1");
        this.current_stage_num = stageListRoot.getChildByName("level_txt2");
        this.next_stage_num = stageListRoot.getChildByName("level_txt3");
        this.state = TopPanel.STATE_NORMAL_BATTLE;

        var self = this;
        // register battle custom event
        this.battleStateChangeListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CUSTOM_EVENT_NAME.BATTLE_START_EVENT,
            callback: function (event) {
                self.refreshStageState(event.getUserData(), player.getBattleNumOfStage(), player.getStageData().getRandomBattleCount());
            }
        });
        cc.eventManager.addListener(this.battleStateChangeListener, 1);

        //var event = new cc.EventCustom(BATTLE_CUSTOM_EVENT.BATTLE_START);
        //event.setUserData(selfPointer._item1Count.toString());
        //cc.eventManager.dispatchEvent(event);


        this.refreshPlayerDiamondText = function () {
            this.playerDiamondText.setString(player.getGem());
        };
        this.refreshPlayerRelicText = function () {
            this.playerRelicText.setString(player.getRelic());
        };
        this.refreshStageState = function (bossBattle, cur, max) {

            // 根据当前stage的battle状态设置gui状态
            if (bossBattle) {
                this.state = BattlePanel.STATE_BOSS_BATTLE;
            } else {
                if (cur >= max - 1) {
                    this.state = BattlePanel.STATE_BOSS_READY;
                } else {
                    this.state = BattlePanel.STATE_NORMAL_BATTLE;
                }
            }
            // 根据gui状态控制各个控件的可见性
            if (this.state === BattlePanel.STATE_NORMAL_BATTLE) {
                this.battleNumText.setString((cur + 1) + '/' + max);
                this.leaveBossBtn.setVisible(false);
                this.fightBossBtn.setVisible(false);
                this.battleNumText.setVisible(true);
                this.stageNumText_bg.setVisible(true);
                this.stage_icon.setVisible(true);
            } else if (this.state === BattlePanel.STATE_BOSS_BATTLE) {
                this.leaveBossBtn.setVisible(true);
                this.fightBossBtn.setVisible(false);
                this.battleNumText.setVisible(false);
                this.stageNumText_bg.setVisible(false);
                this.stage_icon.setVisible(false);
            } else if (this.state === BattlePanel.STATE_BOSS_READY) {
                this.leaveBossBtn.setVisible(false);
                this.fightBossBtn.setVisible(true);
                this.battleNumText.setVisible(false);
                this.stageNumText_bg.setVisible(false);
                this.stage_icon.setVisible(false);
            }
        };
        this.updateStageList = function () {

        };
        this.refreshAll = function () {
            var stage = player.getStageData();
            var cur = player.stage_battle_num;
            var max = stage.getRandomBattleCount();
            this.refreshPlayerDiamondText();
            this.refreshPlayerRelicText();
            this.refreshStageState();
            this.updateStageList();
        };
    }
});

var BattlePanel = cc.Node.extend({

    STATE_NORMAL_BATTLE: 0,
    STATE_BOSS_BATTLE: 1,
    STATE_BOSS_READY: 2,

    ctor: function () {
        this._super();

        this.heroSprites = new SpriteGroup();
        this.enemySprites = new SpriteGroup();


        var battleLayer = ccs.csLoader.createNode(res.battle_layer_json);
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
        }


        //initBattle enemies sprites positions
        this.enemyPos = [];
        for (var i = 0; i < 5; i++) {
            this.enemyPos[i] = this.spritesLayer.getChildByName('enemy' + (i + 1));
        }
        this.setEnemySprite = function (enemy, index) {
            this.enemyPos[index].addChild(enemy);
        }

        this.bossBattle = false;

        this.bindPlayerTapEvent();
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
            target.doDamage(player.getHit());
        }
    },

    initBattleHeroes: function () {
        for (var i = 0; i < player.getHeroCount(); i++) {
            var data = player.getHeroData(i);
            var hero = new HeroUnit(this, data);
            this.heroSprites.push(hero);
            this.setHeroSprite(hero, i);
        }
    },

    initBattleEnemies: function (stage) {
        this.enemySprites.clear();
        var enemyDatas;
        if (this.bossBattle) {
            enemyDatas = stage.getBossEnemDatas();
        } else {
            enemyDatas = stage.getRandomEnemyDatas();
        }

        for (var i = 0; i < enemyDatas.length; i++) {
            var data = enemyDatas[i];
            var enemy = new EnemyUnit(this, data);
            this.enemySprites.push(enemy);
            this.setEnemySprite(enemy, i);
        }
    },

    updateBattleHeroes: function () {
        this.heroSprites.resetSprites();
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
        this.updateBattleHeroes();
        this.initBattleEnemies(stage);
        this.updateEnemyLife();
        this.notifyUpdateTopPanelStageState();
    },

    notifyUpdateTopPanelStageState: function () {
        var event = new cc.EventCustom(CUSTOM_EVENT_NAME.BATTLE_START_EVENT);
        event.setUserData(this.bossBattle);
        cc.eventManager.dispatchEvent(event);
    },

    onRandomBattleWin: function () {
        if (this.bossBattle) {
            player.stage_battle_num = 1;
            this.bossBattle = false;
            player.getStageData().goToNext();
        } else {
            if (this.isLastRandomBattle()) {
                if (player.isAutoBossBattle()) {
                    this.bossBattle = true;
                }
            } else {
                player.stage_battle_num += 1;
                this.bossBattle = false;
            }
        }
        var stageData = player.getStageData();
        this.loadStageBackground(stageData);
        this.initBattleEnemies(stageData);
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
        player.changeBonus(enemy.getBonus());
        //this.updatePlayerGoldText();
        //this.updateTopPanel();
    },

    onEnemyVanish: function (enemy) {
        var win = this.checkBattleWin();
        if (win) {
            this.onRandomBattleWin();
        }
    },

    isLastRandomBattle: function () {
        return player.stage_battle_num >= player.getStageData().getRandomBattleCount() - 1;
    },

});


var TabContainer = cc.Node.extend({

    ctor: function (battlePanel) {
        this._super();

        this.menuLayer = ccs.csLoader.createNode(res.menu_layer_json);
        this.addChild(this.menuLayer);
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
        }

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

var CUSTOM_EVENT_NAME = {

    BATTLE_START_EVENT: "BATTLE_START",
    BATTLE_WIN_EVENT: "BATTLE_WIN",

};

var MainScene = cc.Scene.extend({

    onEnter: function () {
        this._super();

        //battle panel
        this.battlePanel = new BattlePanel(this);
        this.battlePanel.setPosition(0, 100);
        this.addChild(this.battlePanel);

        //top panel
        this.topPanel = new TopPanel(this);
        this.topPanel.setPosition(0, 850);
        this.addChild(this.topPanel);
        this.topPanel.refreshAll();

        //tab container
        this.tabContainer = new TabContainer(this.battlePanel);
        this.tabContainer.setPosition(0, 0);
        this.addChild(this.tabContainer);
        this.tabContainer.updatePlayerGoldText();


        this.tabContainer.showMenuLayer('main');

        this.battlePanel.initBattle(player.getStageData());

    }
});
