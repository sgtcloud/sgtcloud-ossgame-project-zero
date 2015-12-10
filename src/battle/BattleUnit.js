var UNIT_CAMP_PLAYER = 0;
var UNIT_CAMP_ENEMY = 1;


var DamageNumber = cc.Node.extend({
  ctor:function(val,ctr){
    this._super();
    var size = ctr?40:20;
    var text = new cc.LabelTTF(Math.round(val),"Arial",size);
    text.setAnchorPoint(0.5,0.);
    this.addChild(text);
    if(ctr){
      text.color = cc.color(255,100,100);
    }

    var a = cc.scaleTo(0.1,2,2);
    var b = cc.scaleTo(0.1,1,1);

    this.runAction(cc.sequence(a,b));

    var c = cc.moveBy(0.5,0,100);
    var d = cc.callFunc(function(){
      this.removeFromParent(true);
    },this);
    this.runAction(cc.sequence(c,d));
  }
});

var BattleUnit = cc.Node.extend({
  ctor:function(battle,data,camp){
    this._super();
    this.battle = battle;
    this.data = data;
    this.camp = camp;
    this.animateTime = 0;
    this.animateState = 'stand';
    var json = ccs.load(res[this.data.getFile()]);
    this.node = json.node;
    this.animation = json.action;
    this.addChild(this.node);
    {
      var timelines = this.animation.getTimelines();

      for(var i in timelines){
        var timeline = timelines[i];
        var frames = timeline.getFrames();
        for(var j in frames){
          var frame = frames[j];
          if(frame.isTween()){
            frame.setTween(false);
          }
        }
      }
    }
    this.node.runAction(this.animation);

      this.getMaxLife = function(){
          return data.getLife();
      }

    {//data
      this.attack = data.getAttack();
      this.life = data.getLife();
      this.changeLife = function(val){
        this.life += val;
        if(this.life < 0){
          this.life = 0;
        }
      }
      this.reset = function(){
        this.life = this.data.getLife();
        this.animateTime = 0;
        this.playAnimation('stand');
      }
    }
    this.showDamageNumber = function(val,ctr){
      var dmg = new DamageNumber(val,ctr);
      dmg.setPosition(-10+Math.random()*20,150+Math.random()*20);
      this.addChild(dmg);
    }
    this.isDead = function(){
      return this.life <= 0;
    }
    this.isActive = function(){
        return true;
    }
    this.onAttacked = function(){
      console.log("Unit Attack");
    }
    this.onDamaged = function(){
      console.log("Unit Damage");
    }
    this.onDead = function(){
      console.log("Unit Dead");
    }
      this.onClear = function(){
          this.removeFromParent(true);
      }
    this.doDamage = function(dmg,ctr){
      if(ctr){
        dmg *= ctr;
      }
      this.changeLife(-dmg);
      this.showDamageNumber(dmg,ctr);
      this.onDamaged();
      if(this.life <= 0){
        this.playAnimation('die');
        this.onDead();
      }else{
        this.playAnimation('hit');
      }
    }
    this.playAnimation = function(name){
      this.animateState = name;
      this.animation.play(name, false);
    }
    this.onFindTarget = function(){

    }
    this.onUpdateDead = function(dt){

    }
    this.onUpdateAnimate = function(dt){
      if(!this.animation.isPlaying()){
        switch(this.animateState){
          case 'dead':
            break;
          case 'die':
            this.playAnimation('dead');
            break;
          default:
            this.playAnimation('stand');
            break;
        }
      }
    }
    this.update = function(dt){

      this.onUpdateAnimate(dt);
      if(this.life <= 0){
        this.onUpdateDead(dt);
        return;
      }

      {//animate
        var animateDelay = this.data.getAnimateDelay();
        if(animateDelay > 0){
          this.animateTime += dt;
          while(this.animateTime >= animateDelay){
            this.animateTime -= animateDelay;
            this.onAttacked();
          }
        }
      }
    };
    this.reset();
    this.scheduleUpdate();
  }
});

var HeroUnit = BattleUnit.extend({
  ctor:function(battle,data){
    this._super(battle,data,BattleConsts.Camp.Player);
    //this.setScale(UNIT_SCALE,UNIT_SCALE);
    this.recover = 0;
    this.cooldown = 0;

    var lifeNode = ccs.csLoader.createNode(res.hero_blood_json);
    lifeNode.setAnchorPoint(0.5,0.5);
    this.addChild(lifeNode);

    this.lifeBar = lifeNode.getChildByName('root').getChildByName('blood_bar');
    this.refreshLifeBar = function(){
      var max = this.data.getLife();
      this.lifeBar.setPercent(this.life/max*100);
    }
    this.onAttacked = function(){
      var target = battle.filtHeroTarget();
      if(target){
        this.playAnimation('atk');
        if(Math.random() < this.data.getCtrChance()){
          target.doDamage(this.attack,this.data.getCtrModify());
        }else{
          target.doDamage(this.attack);
        }
      }
    }
    this.onDamaged = function(){
      this.refreshLifeBar();
    }
    this.onDead = function(){
      this.recover = data.getRecover();
      battle.onHeroDead(this);
      //var lost = battle.checkPlayerLost();
      //if(lost){
      //  battle.resetBattle();
      //}
    }
    this.onRecover = function() {
        this.reset();
        battle.onHeroRecover(this);
    }
      this.onUseSkill = function(){

      }
    this.getRecover = function(){
      return this.recover;
    }
    this.getCooldown = function(){
      return this.cooldown;
    }
    this.onUpdateDead = function(dt){
      this.recover = Math.max(0,this.recover - dt);
      if(this.recover <= 0){
        this.onRecover();
      }
    }
      this.isActive = function(){
          return !data.isLocked();
      }
  }
});

var EnemyUnit = BattleUnit.extend({
  ctor:function(battle,data){
    this._super(battle,data,BattleConsts.Camp.Enemy);
    this.node.setScale(-1,1);
    this.onAttacked = function(){
      var target = battle.filtEnemyTarget();
      if(target){
        this.playAnimation('atk');
        target.doDamage(this.attack);
      }
    }
    this.onDamaged = function(){
      battle.refreshEnemyLife();
    }
    this.onDead = function() {
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(0.5,0);
        var c = cc.callFunc(this.onVanish,this);
        this.node.runAction(cc.sequence(a, b,c));
        battle.onEnemyDead(this);
    }
      this.onVanish = function(){
          this.removeFromParent(true);
          battle.onEnemyVanish(this);
      }
      this.getBonus = function(){
          return data.getBonus();
      }
  }
});

