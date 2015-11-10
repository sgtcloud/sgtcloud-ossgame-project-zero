var BattleSprite = cc.Sprite.extend({
  data:null,
  type:null,
  animateTime:0,
  animateDelay:0,
  ctor:function(data,type){
    cc.Sprite.prototype.ctor.call(this);
    this.type = type;
    this.refresh(data);
    if(type === 1){
      this.setScaleX(-1);
    }
    this.scheduleUpdate();
  },
  refresh:function(data){
    var self = this;
    self.data = data;
    var file = "res/units/"+data.getId()+".png";
    var img = cc.loader.getRes(file);
    if(img === 'undefined'){
      cc.loader.load([img],function(err,data){
        if(err){console.log("err");return;}
        self.setTexture(file);
      });
    }else{
      self.setTexture(file);
    }

    self.setPosition(0,0);
    self.stopAllActions();
  },
  update:function(dt){
    var self = this;
    self.animateTime += dt;
    if(self.animateTime >= self.data.getAnimateDelay()){
      self.animateTime -= self.data.getAnimateDelay();
      var sx = self.x;
      var dx = self.x + 30;
      var y = self.y;
      if(self.type === 1){
        dx = self.x - 30;
      }
      var ac1 = cc.moveTo(0.1,dx,y);
      var ac2 = cc.moveTo(0.1,sx,y);
      self.runAction(cc.sequence(ac1,ac2));
    }
  }
});

var GameScene = cc.Scene.extend({
  playerLayer:null,
  menuLayer:null,
  battleLayer:null,
  equipLayer:null,

  effectLayer:null,

  effectNode:null,

  heroSprites:[],
  enemySprite:null,

  battleHeroList:null,
  equipHeroList:null,
  equipItemList:null,

  playerGoldText:null,
  playerGemText:null,
  playerLifeText:null,
  playerAttackText:null,
  playerHitText:null,
  enemyLifeText:null,

  playerLifeBar:null,
  enemyLifeBar:null,

  playerLife:0,
  enemyLife:0,
  battleTime:0,
  onEnter:function(){
    this._super();
    var self = this;

    self.playerLayer = ccs.csLoader.createNode(res.player_layer_json);
    self.menuLayer = ccs.csLoader.createNode(res.menu_layer_json);
    self.battleLayer = ccs.csLoader.createNode(res.battle_layer_json);
    self.equipLayer = ccs.csLoader.createNode(res.equip_layer_json);

    self.playerGoldText = self.playerLayer.getChildByName("player_gold");
    self.playerGemText = self.playerLayer.getChildByName("player_gem");

    self.battleHeroList = self.battleLayer.getChildByName("hero_pane").getChildByName("list_view");
    self.equipHeroList = self.equipLayer.getChildByName("hero_pane").getChildByName("list_view");
    self.equipItemList = self.equipLayer.getChildByName("equip_pane").getChildByName("list_view");

    var battlePane = self.battleLayer.getChildByName("battle_pane");
    self.playerLifeText = battlePane.getChildByName("player_life_text");
    self.playerAttackText = battlePane.getChildByName("player_attack_text");
    self.playerHitText = battlePane.getChildByName("player_hit_text");
    self.enemyLifeText = battlePane.getChildByName("enemy_life_text");
    self.playerLifeBar = battlePane.getChildByName("player_life_bar");
    self.enemyLifeBar = battlePane.getChildByName("enemy_life_bar");
    self.effectNode = battlePane.getChildByName("effect_node");

    self.equipLayer.setVisible(false);

    cc.eventManager.addListener(cc.EventListener.create({
      event : cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan : function(touch, event) {
        // console.log(event.ge);
        var pos = touch.getLocation(); //当前事件发生的光标位置
        var target = event.getCurrentTarget(); //事件绑定的目标
        //             //判断当前事件发生的位置是否在事件目标区域内
        if( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {
          // cc.log("Touch Down");
          pos.x -= battlePane.x;
          pos.y -= battlePane.y;
          self.showPlayerHit(pos,battlePane);
          return true;
        }
        return false;
      }
    }), battlePane);

    // battlePane.addTouchEventListener(function(sender, type){
    //   if(type == ccui.Widget.TOUCH_BEGAN){
    //     console.log("dsad");
    //   }
    // });


    // ccs.armatureDataManager


    var initPlayerLayer = function(){
      self.playerLayer.setPosition(0,cc.winSize.height-120);
      self.addChild(self.playerLayer);

      var playerName = self.playerLayer.getChildByName("player_name");
      playerName.setString(player.getName());
    }

    var initMenuLayer = function(){

      self.menuLayer.setPosition(0,0);
      self.addChild(self.menuLayer);

      self.menuLayer.getChildByName("hero_btn").addTouchEventListener(function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
          self.battleLayer.setVisible(true);
          self.equipLayer.setVisible(false);
        }
      });
      self.menuLayer.getChildByName("equip_btn").addTouchEventListener(function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
          self.battleLayer.setVisible(false);
          self.equipLayer.setVisible(true);
        }
      });
    }

    var initBattleLayer = function(){

      self.battleLayer.setPosition(0,100);
      self.addChild(self.battleLayer);

      var battle = player.getBattle();

      var battlePane = self.battleLayer.getChildByName("battle_pane");

      var skillBtn = battlePane.getChildByName("skill_button_0");
      skillBtn.addTouchEventListener(function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
          self.showPlayerSkill_0(this,battlePane);
        }
      },player.getHero(0));

      var initHeros = function(){
        for(var i in player.getHeros()){
          var pos = battlePane.getChildByName("hero_pos_"+i);
          var hero = player.getHero(i);
          var sprite = new BattleSprite(hero,0);
          sprite.setAnchorPoint(0.5,0);
          pos.addChild(sprite);
          self.heroSprites[hero.id] = sprite;
        }
      }
      var initEnemy = function(){
        var pos = battlePane.getChildByName("enemy_pos");
        var battle = player.getBattle();
        var enemy = battle.getEnemy(battle.getState());
        self.enemySprite = new BattleSprite(enemy,1);
        self.enemySprite.setAnchorPoint(0.5,0);
        self.enemySprite.setScaleX(-1);
        pos.addChild(self.enemySprite);
      }
      var initList = function(){
        var heroView = ccs.csLoader.createNode(res.battle_hero_view_json).getChildByName("view_root");;

        for(var i in player.getHeros()){
          var hero = player.getHero(i);
          var root = heroView.clone();
          self.battleHeroList.addChild(root,i,i);

          root.getChildByName("hero_lv").setString(hero.getLv());
          root.getChildByName("hero_name").setString(hero.getName());
          root.getChildByName("hero_life").setString(hero.getLife());
          root.getChildByName("hero_attack").setString(hero.getAttack());
          root.getChildByName("hero_hit").setString(hero.getHit());


          var activeBtn = root.getChildByName("active_btn");
          var upgradeBtn = root.getChildByName("upgrade_btn");
          activeBtn.setBright(false);
          // switch(hero.getState()){
          //   case 0:
              activeBtn.setTitleText("购买");
          //
          //     break;
          //   case 1:
          //     activeBtn.setTitleText("出击");
          //     break;
          //   case 2:
          //     activeBtn.setTitleText("待机");
          //     break;
          // }
          upgradeBtn.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_BEGAN){
              // console.log(this);
              if(this.upgrade()){
                self.refreshPlayerStatus();
              }
            }
          },hero);
        }
      }
      initHeros();
      initEnemy();
      initList();
    }

    var initEquipLayer = function(){

      self.equipLayer.setPosition(0,100);
      self.addChild(self.equipLayer);

      var initHeros = function(){
        var heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName("view_root");
        for(var i in player.getHeros()){
          var hero = player.getHero(i);
          var root = heroView.clone();
          self.equipHeroList.addChild(root,i,i);

          root.getChildByName("hero_lv").setString(hero.getLv());
          root.getChildByName("hero_name").setString(hero.getName());
          root.getChildByName("hero_life").setString(hero.getLife());
          root.getChildByName("hero_attack").setString(hero.getAttack());
          root.getChildByName("hero_hit").setString(hero.getHit());
        }
      }
      var initItems = function(){
        var itemView = ccs.csLoader.createNode(res.equip_item_view_json).getChildByName("view_root");
        for(var i=0;i<5;i++){
          var root = itemView.clone();
          self.equipItemList.addChild(root,i,i);

          var upgradeBtn = root.getChildByName("upgrade_btn");
          upgradeBtn.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_BEGAN){
              // console.log(this);
              var hero = player.getHero(self.equipHeroList.getCurSelectedIndex());
              if(hero.getEquip(this).upgrade(hero)){
                self.refreshPlayerStatus();
              }
            }
          },new Number(i));
        }
      }

      self.equipHeroList.addEventListener(function (sender, type){
        if(type == ccui.ListView.ON_SELECTED_ITEM_END){
          // cc.log("select child index = " + sender.getCurSelectedIndex());
          self.refreshEquipItemList();
        }
      },self);

      initHeros();
      initItems();
    }

    initBattleLayer();
    initEquipLayer();

    initPlayerLayer();
    initMenuLayer();

    self.scheduleUpdate();


    self.refreshEquipItemList();

    self.refreshPlayerStatus();
    self.refreshBattleStatus(true);

    // self.battleHeroList.getchild
  },
  update:function(dt){
    var self = this;
    self.battleTime += dt;
    // console.log(dt);
    // console.log(self.enemyLife);
    if(self.battleTime >= 1){
      self.battleTime -= 1;
      self.updateBattleAttack();
    }
  },
  damageEnemy:function(damage){
    var self = this;
    var battle = player.getBattle();
    self.enemyLife -= damage;
    if(self.enemyLife <= 0){
      player.notifyStateWin();
      battle.nextState();
      var enemy = battle.getEnemy(battle.getState());
      self.enemySprite.refresh(enemy);
      self.refreshBattleStatus(true);
      self.refreshPlayerStatus();
      return true;
    }
    self.refreshBattleStatus(false);
    return false;
  },
  updateBattleAttack:function(){
    var self = this;
    var battle = player.getBattle();
    var enemy = battle.getEnemy(battle.getState());
    var enemyAttack = enemy.getAttack();

    self.playerLife -= enemyAttack;
    if(self.playerLife <= 0){
      self.refreshBattleStatus(true);
      return;
    }

    if(self.damageEnemy(player.getAttack())){
      return;
    }
  },
  refreshBattleStatus:function(init){
    var self = this;
    var battle = player.getBattle();
    var enemy = battle.getEnemy(battle.getState());

    var playerLifeMax = player.getLife();
    var enemyLifeMax = enemy.getLife();

    if(init){
      self.playerLife = playerLifeMax;
      self.enemyLife = enemyLifeMax;
      self.battleTime = 0;
    }
    self.playerLifeBar.percent = self.playerLife / playerLifeMax * 100;
    self.enemyLifeBar.percent = self.enemyLife / enemyLifeMax * 100;

    self.playerLifeText.setString(self.playerLife);
    self.enemyLifeText.setString(self.enemyLife);
  },
  refreshPlayerStatus:function(){
    var self = this;
    self.playerAttackText.setString(player.getAttack()+"/秒");
    self.playerHitText.setString(player.getHit()+"/秒");
    self.playerGoldText.setString(player.getGold());
    self.playerGemText.setString(player.getGem());
  },
  refreshEquipItemList:function(){
    var self = this;
    var index = self.equipHeroList.getCurSelectedIndex();
    var hero = player.getHero(index);

    var views = self.equipItemList.getChildren();
    console.log(views);
    for(var i in hero.getEquips()){
      var item = hero.getEquip(i);
      // console.log(item);
      var root = views[i];
      root.getChildByName("item_name").setString(item.getName());
      root.getChildByName("item_life").setString(item.getLife());
      root.getChildByName("item_attack").setString(item.getAttack());
      root.getChildByName("item_hit").setString(item.getHit());
      // self.equipItemList.addChild(root);
    }
  },
  showPlayerHit:function(pos,parent){
    var frames = [];
    for(var i in player_hit_frames){
      frames[i] = cc.spriteFrameCache.getSpriteFrame(player_hit_frames[i]);
    }
    var self = this;
    var eff = new cc.Sprite();
    eff.setPosition(pos.x,pos.y-100);
    var a1 = new cc.Animate(new cc.Animation(frames, 0.05));
    var a2 = new cc.RemoveSelf(true);
    eff.runAction(cc.sequence(a1,a2));
    parent.addChild(eff);
    self.damageEnemy(player.getHit());
  },
  showPlayerSkill_0:function(hero,parent){
    var frames = [];
    for(var i in player_hit_frames){
      frames[i] = cc.spriteFrameCache.getSpriteFrame(skill_0_frames[i]);
    }
    var self = this;
    for(var i=0;i<5;i++){
      var eff = new cc.Sprite();
      var x = 320 + Math.random() * 320;
      var y = 50 + Math.random() * 200;
      eff.setPosition(x,y);
      var a0 = new cc.DelayTime(i*0.1);
      var a1 = new cc.Animate(new cc.Animation(frames, 0.05));
      var a2 = new cc.RemoveSelf(true);
      eff.runAction(cc.sequence(a0,a1,a2));

      var aa = new cc.ScaleBy(0.25,3,3);
      eff.runAction(aa);
      parent.addChild(eff);
    }
    self.damageEnemy(hero.getAttack()*3);

    // self.damageEnemy(player.getHit());
  },
  onHeroUpdate:function(hero){
    var self = this;
    var battleViews = self.battleHeroList.getChildren();
    var equipViews = self.equipHeroList.getChildren();
    for(var i in player.getHeros()){
      if(hero.getId() === player.getHero(i).getId()){
        battleViews[i].getChildByName("hero_lv").setString(hero.getLv());
        battleViews[i].getChildByName("hero_name").setString(hero.getName());
        battleViews[i].getChildByName("hero_life").setString(hero.getLife());
        battleViews[i].getChildByName("hero_attack").setString(hero.getAttack());
        battleViews[i].getChildByName("hero_hit").setString(hero.getHit());

        equipViews[i].getChildByName("hero_lv").setString(hero.getLv());
        equipViews[i].getChildByName("hero_name").setString(hero.getName());
        equipViews[i].getChildByName("hero_life").setString(hero.getLife());
        equipViews[i].getChildByName("hero_attack").setString(hero.getAttack());
        equipViews[i].getChildByName("hero_hit").setString(hero.getHit());
        self.refreshPlayerStatus();
        return;
      }
    }
  },
  onEquipUpdate:function(hero,equip){
    var self = this;
    var views = self.equipItemList.getChildren();
    for(var i in hero.getEquips()){
      if(equip.getId() == hero.getEquip(i).getId()){
        var root = views[i];
        root.getChildByName("item_name").setString(equip.getName());
        root.getChildByName("item_life").setString(equip.getLife());
        root.getChildByName("item_attack").setString(equip.getAttack());
        root.getChildByName("item_hit").setString(equip.getHit());
      }
    }
  },

  showDamageNumber:function(pos,parent){

  },
});
