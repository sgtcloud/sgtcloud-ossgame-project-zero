var SpriteGroup = function(_sprites){
    var sprites = _sprites || [];

    this.get = function(i){
        return sprites[i];
    }
    this.count = function(){
        return sprites.length;
    }
    this.foreach = function(callback,context){
        for(var i in sprites){
            callback.call(context,sprites[i],i);
        }
    }
    this.push = function(sprite){
        sprites.push(sprite);
    }
    this.clear = function(){
        while(sprites.length > 0){
            sprites[0].onClear();
            sprites.splice(0,1);
        }
    }
    this.getLife = function(){
        var val = 0;
        for(var i in sprites){
            var sprite = sprites[i];
            val += sprite.life;
        }
        return val;
    }
    this.resetSprites = function(){
        for(var i in sprites){
            var sprite = sprites[i];
            sprite.reset();
        }
    }
    this.findFirstAlive = function(){
        for(var i in sprites){
            var sprite = sprites[i];
            if(sprite.life > 0){
                return sprite;
            }
        }
        return undefined;
    }
    this.findRandomAlive = function(){
        var temp = [];
        for(var i in sprites){
            var sprite = sprites;
            if(sprite.life > 0){
                temp.push(sprite);
            }
        }
        if(temp.length > 0){
            var rand = Math.round(Math.random()*(temp.length-1));
            return temp[rand];
        }
        return undefined;
    }
}

var TitleLayer = cc.Node.extend({
    ctor:function(battle){
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
        this.refreshPlayerDiamondText = function(){
            this.playerDiamondText.setString(player.getGem());
        };
        this.refreshPlayerRelicText = function(){
            this.playerRelicText.setString(player.getRelic());
        }
        this.refreshBattleState = function(){
            var stage = player.getStageData();
            this.battleStateText.setString((stage.getBattleState()+1) + '/' + stage.getBattleCount());
            if(stage.isBossBattle()){
                this.battleStateText.setVisible(false);
                this.goBossBtn.setVisible(false);
                this.liveBossBtn.setVisible(true);
            }else{
                if(stage.isLastBattle()){
                    if(stage.isAutoBoss()){
                        this.battleStateText.setVisible(true);
                        this.goBossBtn.setVisible(false);
                        this.liveBossBtn.setVisible(false);
                    }else{
                        this.battleStateText.setVisible(false);
                        this.goBossBtn.setVisible(true);
                        this.liveBossBtn.setVisible(false);
                    }
                }else{
                    this.battleStateText.setVisible(true);
                    this.goBossBtn.setVisible(false);
                    this.liveBossBtn.setVisible(false);
                }
            }
        }
    }
});

var BattleLayer = cc.Node.extend({
    ctor:function(battle){
        this._super();
        var layer = ccs.csLoader.createNode(res.batter_layer_json);
        this.addChild(layer);

        this.heroSprites = new SpriteGroup();
        this.enemySprites = new SpriteGroup();

        var root = layer.getChildByName('root');
        this.enemyLifeText = root.getChildByName('enemy_life_text');
        this.enemyLifeBar = root.getChildByName('enemy_life_bar');

        this.refreshEnemyLife = function(){
            var battle = player.getStageData().getCurrentBattle();
            var max = battle.getEnemysLife();
            var life = this.enemySprites.getLife();
            this.enemyLifeText.setString(life);
            this.enemyLifeBar.setPercent(life/max*100);
        };
        this.bindPlayerTapEvent = function(){
            var root = layer.getChildByName('root');
            var tap = root.getChildByName('tap');
            var listener = cc.EventListener.create({
                event : cc.EventListener.MOUSE,
                onMouseDown : function(event) {
                    var pos = event.getLocation(); //当前事件发生的光标位置
                    pos.y -= 120;
                    var target = event.getCurrentTarget(); //事件绑定的目标
                    //判断当前事件发生的位置是否在事件目标区域内
                    if( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {
                        // cc.log("Mouse Down");
                        // console.log(self);
                        self.onPlayerTap();
                        return true;
                    }
                    return false;
                },
                onMouseUp : function(event) {
                    var pos = event.getLocation();
                    pos.y -= 120;
                    var target = event.getCurrentTarget();
                    if( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {
                        // cc.log("Mouse up");
                        return true;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listener, tap);
        };


        {//heros
            var root = layer.getChildByName('root');
            this.spritesLayer = root.getChildByName('sprites');
            for(var i=0;i<player.getHeroCount();i++){
                var pos = this.spritesLayer.getChildByName('hero'+(i+1));
                var data = player.getHeroData(i);
                var hero = new HeroUnit(battle,data);
                this.heroSprites.push(hero);
                pos.addChild(hero);
            }
        }
        {//enemys
            this.refreshBattleEnemys = function(){
                var data = player.getStageData().getCurrentBattle();
                this.enemySprites.clear();
                for(var i=0;i<data.getEnemyCount();i++){
                    var pos = this.spritesLayer.getChildByName('enemy'+(i+1));
                    var enemy = new EnemyUnit(battle,data.getEnemyData(i));
                    this.enemySprites.push(enemy);
                    pos.addChild(enemy);
                }
            }
        }

        this.bindPlayerTapEvent();
    }

});

var BattleScene = cc.Scene.extend({
	onEnter:function() {
        this._super();
        var self = this;
        var size = cc.winSize;

        {//battle
            this.battleLayer = new BattleLayer(this);
            this.battleLayer.setPosition(0,100);
            this.addChild(this.battleLayer);
            this.refreshEnemyLife = function(){
                this.battleLayer.refreshEnemyLife();
            }
            this.refreshBattleEnemys = function(){
                this.battleLayer.refreshBattleEnemys();
            }
            this.resetBattleHeros = function(){
                this.battleLayer.heroSprites.resetSprites();
            }
            this.filtHeroTarget = function(){
                return this.battleLayer.enemySprites.findFirstAlive();
            }
            this.filtEnemyTarget = function(){
                return this.battleLayer.heroSprites.findRandomAlive();
            }
            this.checkPlayerWin = function(){
                return !this.battleLayer.enemySprites.findFirstAlive();
            }
            this.checkPlayerLost = function(){
                return !this.battleLayer.heroSprites.findFirstAlive();
            }
            this.foreachHeroSprite = function(callback){
                this.battleLayer.heroSprites.foreach(callback);
            }
        }


        {//title
            this.titleLayer = new TitleLayer(this);
            this.titleLayer.setPosition(0, 850);
            this.addChild(this.titleLayer);
            this.refreshTitleLayer = function(){
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
				{name:"main",click:"onMainClick"},
				{name:"hero",click:"onHeroClick"},
				{name:"equip",click:"onEquipClick"},
				{name:"pvp",click:"onPvpClick"},
				{name:"rank",click:"onRankClick"},
				{name:"shop",click:"onShopClick"},
			];
			this.menuButtons = {};
			for(var i in menuParams){
				var param = menuParams[i];
				var name = param.name;
				var click = param.click;
				this.menuButtons[name] = root.getChildByName(name);
				this.menuButtons[name].addEventListener(function(sender, type){
					if(type === ccui.CheckBox.EVENT_SELECTED){
						self.showMenuLayer(sender.name);
					}else if(type === ccui.CheckBox.EVENT_UNSELECTED){
						sender.setSelected(true);
					}
				},this);

			}

			this.menuLayers = {};
			this.menuLayers.main = new SkillListMenu(this);
			this.menuLayers.hero = new HeroListMenu(this);
			this.menuLayers.equip = new EquipListMenu(this);

			for(var i in this.menuLayers){
				this.battleLayer.addChild(this.menuLayers[i]);
			}
			this.showMenuLayer = function(name) {
				for(var i in this.menuLayers) {
					this.menuLayers[i].setVisible(false);
				}
				this.menuLayers[name].setVisible(true);
				for (var i in this.menuButtons) {
					this.menuButtons[i].setSelected(false);
				}
				this.menuButtons[name].setSelected(true);
			}

			this.showMenuLayer('main');
			//for (var i in this.menuButtons) {
			//	this.menuButtons[i].setEnabled(false);
			//}
			this.refreshPlayerGoldText = function(){
				for(var i in this.menuLayers) {
					this.menuLayers[i].refreshPlayerGoldText();
				}
			}
		}



		this.onPlayerTap = function(){
			var target = this.filtHeroTarget();
			if(target){
				target.doDamage(player.getHit());
			}
		};
		this.changeBattle = function(){
			var a = cc.delayTime(1);
			var b = cc.callFunc(this.onChangeBattle, this);
			this.runAction(cc.sequence(a,b));
		}
		this.resetBattle = function(){
			var a = cc.delayTime(1);
			var b = cc.callFunc(this.onResetBattle, this);
			this.runAction(cc.sequence(a,b));
		}
		this.onChangeBattle = function(){
			this.refreshBattleEnemys();
			this.refreshEnemyLife();
			this.refreshTitleLayer();
			this.resetBattleHeros();
		}
		this.onResetBattle = function(){
			this.refreshBattleEnemys();
			this.refreshEnemyLife();
			this.refreshTitleLayer();
            this.resetBattleHeros();
		}
		this.goNextBattle = function(){
			var next = player.getStageData().goNextBattle();
			if(next){
				// player.getBattle().change(next);
				this.changeBattle();
			}else{
				// player.getBattle().reset();
				// this.changeBattle();
			}
		}


		this.onHeroDead = function(hero){
			this.menuLayers.main.onHeroDead(hero);
		}
		this.onHeroRecover = function(hero){
			this.menuLayers.main.onHeroRecover(hero);
		}
        this.onUseSkill = function(i){

        }



		this.refreshBattleEnemys();
		this.refreshPlayerGoldText();

        this.refreshEnemyLife();
        this.refreshTitleLayer();


  }
});
