
var BattleScene = cc.Scene.extend({
	onEnter:function(){
    this._super();
		var self = this;
		var size = cc.winSize;

		{//load
			this.addChild(this.titleLayer = ccs.csLoader.createNode(res.title_layer_json));
			this.addChild(this.battleLayer = ccs.csLoader.createNode(res.batter_layer_json));
			this.addChild(this.menuLayer = ccs.csLoader.createNode(res.menu_layer_json));
		}

		{//titleLayer
			this.titleLayer.setPosition(0,size.height-110)
			{//diamond and relic
				var root = this.titleLayer.getChildByName('root');
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
		}

		{//batttleLayer
			var root = this.battleLayer.getChildByName('root');
			this.playerGoldText = root.getChildByName('gold_text');
			this.enemyLifeText = root.getChildByName('enemy_life_text');
			this.enemyLifeBar = root.getChildByName('enemy_life_bar');
			this.herosAttackText = root.getChildByName('atk_text');
			this.playerTapText = root.getChildByName('tatk_text');

			this.refresHerosAttackText = function(){
				this.herosAttackText.setString(player.getAttack());
			};
			this.refreshPlayerTapText = function(){
				this.playerTapText.setString(player.getHit());
			};
			this.refreshEnemyLifeText = function(){
				var battle = player.getStageData().getCurrentBattle();
				var max = battle.getEnemysLife();
				var life = 0;
				for(var i=0;i<this.enemySprites.length;i++){
					life += this.enemySprites[i].life;
				}
				this.enemyLifeText.setString(life);
				this.enemyLifeBar.setPercent(life/max*100);
			};
			this.bindPlayerTapEvent = function(){
				var root = this.battleLayer.getChildByName('root');
				var bg = root.getChildByName('battle_bg');
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
				cc.eventManager.addListener(listener, bg);
			};
			this.battleLayer.setPosition(0,100);

		}

		{//unit
			this.heroSprites = [];
			this.enemySprites = [];
			{//heros
				var root = this.battleLayer.getChildByName('root');
				this.spritesLayer = root.getChildByName('sprites');
				for(var i=0;i<player.getHeroCount();i++){
					var pos = this.spritesLayer.getChildByName('hero'+(i+1));
					var hero = new HeroUnit(this,player.getHeroData(i));
					this.heroSprites[i] = hero;
					pos.addChild(this.heroSprites[i]);
				}
			}
			{//enemys
				this.refreshBattleEnemys = function(){
					var battle = player.getStageData().getCurrentBattle();

					for(var i=0;i<this.enemySprites.length;i++){
						this.enemySprites[i].removeFromParent(true);
					}
					for(var i=0;i<battle.getEnemyCount();i++){
						var pos = this.spritesLayer.getChildByName('enemy'+(i+1));
						var enemy = new EnemyUnit(this,battle.getEnemyData(i));
						this.enemySprites[i] = enemy;
						pos.addChild(this.enemySprites[i]);
					}
				}

			}
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



		this.filtHeroTarget = function(){
			for(var i=0;i<this.enemySprites.length;i++){
				if(this.enemySprites[i].life > 0){
					return this.enemySprites[i];
				}
			}
			return undefined;
		}
		this.filtEnemyTarget = function(){
			var temp = [];
			for(var i=0;i<this.heroSprites.length;i++){
				if(this.heroSprites[i].life > 0){
					temp.push(this.heroSprites[i]);
				}
			}
			if(temp.length > 0){
				var rand = Math.round(Math.random()*(temp.length-1));
				return temp[rand];
			}
			return undefined;
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
			this.refreshEnemyLifeText();
			this.refreshBattleState();
			for(var i=0;i<this.heroSprites.length;i++){
				this.heroSprites[i].reset();
			}
		}
		this.onResetBattle = function(){
			this.refreshBattleEnemys();
			this.refreshEnemyLifeText();
			this.refreshBattleState();
			for(var i=0;i<this.heroSprites.length;i++){
				this.heroSprites[i].reset();
			}
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
		this.checkPlayerWin = function(){
			for(var i=0;i<this.enemySprites.length;i++){
				if(this.enemySprites[i].life > 0){
					return false;
				}
			}
			return true;
		}
		this.checkPlayerLost = function(){
			for(var i=0;i<this.heroSprites.length;i++){
				if(this.heroSprites[i].life > 0){
					return false;
				}
			}
			return true;
		}
		this.onHeroDead = function(hero){
			this.menuLayers.main.onHeroDead(hero);
		}
		this.onHeroRecover = function(hero){
			this.menuLayers.main.onHeroRecover(hero);
		}

		this.refreshBattleEnemys();
		this.refreshEnemyLifeText();
		this.refreshPlayerGoldText();
		this.refreshPlayerDiamondText();
		this.refreshPlayerRelicText();
		this.refresHerosAttackText();
		this.refreshPlayerTapText();
		this.refreshBattleState();
		this.bindPlayerTapEvent();
  }
});
