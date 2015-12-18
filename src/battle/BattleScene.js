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
}

var TitleLayer = cc.Node.extend({
    ctor: function (battle) {
        this._super();
        var layer = ccs.csLoader.createNode(res.title_layer_json);
        this.addChild(layer);

        var root = layer.getChildByName('root');
        var pane = root.getChildByName('box');
        this.playerDiamondText = pane.getChildByName('gold_text');
        this.playerRelicText = pane.getChildByName('relic_text');
        this.battleStateText = root.getChildByName('level_text');
        this.goBossBtn = root.getChildByName('fight_btn');
        this.liveBossBtn = root.getChildByName('live_btn');
        this.refreshPlayerDiamondText = function () {
            this.playerDiamondText.setString(player.getGem());
        };
        this.refreshPlayerRelicText = function () {
            this.playerRelicText.setString(player.getRelic());
        }
        this.refreshBattleState = function () {
            var stage = player.getStageData();
            var cur = battle.battleCount;
            var max = stage.getRandomBattleCount();

            if (battle.bossBattle) {
                this.liveBossBtn.setVisible(true);
                this.goBossBtn.setVisible(false);
                this.battleStateText.setVisible(false);
            } else {
                this.liveBossBtn.setVisible(false);
                if (cur >= max - 1) {
                    if (player.isAutoBossBattle()) {
                        this.battleStateText.setString((cur + 1) + '/' + max);
                        this.goBossBtn.setVisible(false);
                    } else {
                        this.goBossBtn.setVisible(true);
                        this.battleStateText.setVisible(false);
                    }
                } else {
                    this.battleStateText.setString((cur + 1) + '/' + max);
                    this.goBossBtn.setVisible(false);
                }

            }


            this.goBossBtn.setVisible(false);
            this.liveBossBtn.setVisible(false);

            //if(stage.isBossBattle()){
            //    this.battleStateText.setVisible(false);
            //    this.goBossBtn.setVisible(false);
            //    this.liveBossBtn.setVisible(true);
            //}else{
            //    if(stage.isLastBattle()){
            //        if(stage.isAutoBoss()){
            //            this.battleStateText.setVisible(true);
            //            this.goBossBtn.setVisible(false);
            //            this.liveBossBtn.setVisible(false);
            //        }else{
            //            this.battleStateText.setVisible(false);
            //            this.goBossBtn.setVisible(true);
            //            this.liveBossBtn.setVisible(false);
            //        }
            //    }else{
            //        this.battleStateText.setVisible(true);
            //        this.goBossBtn.setVisible(false);
            //        this.liveBossBtn.setVisible(false);
            //    }
            //}
        }
    }
});

var BattleLayer = cc.Node.extend({


    ctor: function (battle) {
        this._super();

        var layer = ccs.csLoader.createNode(res.battle_layer_json);
        this.addChild(layer);


        var root = layer.getChildByName('root');
        this.enemyLifeText = root.getChildByName('enemy_life_text');
        this.enemyLifeBar = root.getChildByName('enemy_life_bar');
        this.battle_bg = root.getChildByName('battle_bg');

        this.refreshEnemyLife = function () {
            var max = battle.enemySprites.getMaxLife();
            var life = battle.enemySprites.getLife();
            this.enemyLifeText.setString(life);
            this.enemyLifeBar.setPercent(life / max * 100);
        };

        this.changeStageBg = function (bg_image_url) {
            cc.textureCache.addImageAsync("res/stages/" + bg_image_url, this.stageBgLoaded, this);
        }

        this.stageBgLoaded = function (textureBg) {
            if (textureBg) {
                this.battle_bg.removeAllChildren();
                var bg = new cc.Sprite(textureBg);
                bg.attr({
                        x: this.battle_bg.width / 2,
                        y: this.battle_bg.height / 2
                    }
                );
                this.battle_bg.addChild(bg);
            }
        }

        this.bindPlayerTapEvent = function () {
            var root = layer.getChildByName('root');
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
        {//heros
            this.heroPos = [];

            for (var i = 0; i < 7; i++) {
                this.heroPos[i] = this.spritesLayer.getChildByName('hero' + (i + 1));
            }
            this.setHeroSprite = function (hero, index) {
                this.heroPos[index].addChild(hero);
            }


        }
        {//enemys
            this.enemyPos = [];
            for (var i = 0; i < 5; i++) {
                this.enemyPos[i] = this.spritesLayer.getChildByName('enemy' + (i + 1));
            }
            this.setEnemySprite = function (enemy, index) {
                this.enemyPos[index].addChild(enemy);
            }
        }

        this.bindPlayerTapEvent();
    }

});

var BattleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var self = this;
        var size = cc.winSize;
        this.battleCount = 0;
        this.bossBattle = false;

        {//battle
            this.heroSprites = new SpriteGroup();
            this.enemySprites = new SpriteGroup();

            this.battleLayer = new BattleLayer(this);
            this.battleLayer.setPosition(0, 100);
            this.addChild(this.battleLayer);

            this.buildBatttleHeros = function () {
                for (var i = 0; i < player.getHeroCount(); i++) {
                    var data = player.getHeroData(i);
                    var hero = new HeroUnit(this, data);
                    this.heroSprites.push(hero);
                    this.battleLayer.setHeroSprite(hero, i);
                }
            }
            this.buildBattleEnemys = function () {
                this.enemySprites.clear();
                var stage = player.getStageData();
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
                    this.battleLayer.setEnemySprite(enemy, i);
                }
            }
            this.setStageBg = function () {
                var stage = player.getStageData();
                this.battleLayer.changeStageBg(stage.getBg())
            }
            this.refreshEnemyLife = function () {
                this.battleLayer.refreshEnemyLife();
            }
            this.resetBattleHeros = function () {
                this.heroSprites.resetSprites();
            }
            this.filtHeroTarget = function () {
                return this.enemySprites.findFirstAlive();
            }
            this.filtEnemyTarget = function () {
                return this.heroSprites.findRandomAlive();
            }
            this.checkPlayerWin = function () {
                return !this.enemySprites.findFirstAlive();
            }
            this.checkPlayerLost = function () {
                return !this.heroSprites.findFirstAlive();
            }
            this.foreachHeroSprite = function (callback) {
                this.heroSprites.foreach(callback);
            }
        }


        {//title
            this.titleLayer = new TitleLayer(this);
            this.titleLayer.setPosition(0, 850);
            this.addChild(this.titleLayer);
            this.refreshTitleLayer = function () {
                this.titleLayer.refreshPlayerDiamondText();
                this.titleLayer.refreshPlayerRelicText();
                this.titleLayer.refreshBattleState();
            }
        }

        {//load

            this.addChild(this.menuLayer = ccs.csLoader.createNode(res.menu_layer_json));

        }

        {//menuLayer
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

            this.menuLayer = new cc.Node();
            this.battleLayer.addChild(this.menuLayer);

            this.menus = {};
            this.menus.main = new SkillListMenu(this);
            this.menus.hero = new HeroListMenu(this);
            this.menus.equip = new EquipListMenu(this);


            for (var i in this.menus) {
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

            this.showMenuLayer('main');
            //for (var i in this.menuButtons) {
            //	this.menuButtons[i].setEnabled(false);
            //}
            this.refreshPlayerGoldText = function () {
                for (var i in this.menuLayers) {
                    this.menuLayers[i].refreshPlayerGoldText();
                }
            }
        }

        this.onPlayerTap = function () {
            var target = this.filtHeroTarget();
            if (target) {
                target.doDamage(player.getHit());
            }
        };

        this.isLastRandomBattle = function () {
            return this.battleCount >= player.getStageData().getRandomBattleCount() - 1;
        }
        this.onRandomBattleWin = function () {
            if (this.bossBattle) {
                this.battleCount = 0;
                this.bossBattle = false;
                player.getStageData().goToNext();
            } else {
                if (this.isLastRandomBattle()) {
                    if (player.isAutoBossBattle()) {
                        this.bossBattle = true;
                    }
                } else {
                    this.battleCount += 1;
                    this.bossBattle = false;
                }
            }
            this.buildBattleEnemys();
            this.refreshEnemyLife();
            this.refreshTitleLayer();
            this.resetBattleHeros();
        }

        this.onHeroDead = function (hero) {
            this.menus.main.onHeroDead(hero);
        }
        this.onHeroRecover = function (hero) {
            this.menus.main.onHeroRecover(hero);
        }
        this.onUseSkill = function (i) {

        }

        this.onEnemyDead = function (enemy) {
            player.changeBonus(enemy.getBonus());
            this.refreshPlayerGoldText();
            this.refreshTitleLayer();
        }
        this.onEnemyVanish = function (enemy) {
            var win = this.checkPlayerWin();
            if (win) {
                this.onRandomBattleWin();
            }
        }
        this.setStageBg();
        this.buildBatttleHeros();
        this.buildBattleEnemys();

        this.refreshPlayerGoldText();

        this.refreshEnemyLife();
        this.refreshTitleLayer();


    }
});
