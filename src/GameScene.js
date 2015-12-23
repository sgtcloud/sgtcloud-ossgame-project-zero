var BattleSprite = cc.Sprite.extend({
  battle:null,
  data:null,
  type:null,
  animateTime:0,
  animateDelay:0,
  life:0,
  ctor:function(battle,data,type){
    cc.Sprite.prototype.ctor.call(this);
    this.battle = battle;
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
    self.life = data.getLife();
    console.log(self.life);
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
    if(self.life <= 0){
      return;
    }
    self.animateTime += dt;
    if(self.animateTime >= self.data.getAnimateDelay()){
      self.animateTime -= self.data.getAnimateDelay();
      // var sx = self.x;
      // var dx = self.x + 30;
      // var y = self.y;
      // if(self.type === 1){
      //   dx = self.x - 30;
      // }
      // var ac1 = cc.moveTo(0.1,dx,y);
      // var ac2 = cc.moveTo(0.1,sx,y);
      // self.runAction(cc.sequence(ac1,ac2));
      self.showAttackAnimation();
      self.onAttack();
      // self.battle.onUnitAttack(self);
    }
  },
  showAttackAnimation:function(){
    var self = this;
    var a1 = cc.tintTo(0.025, 255,0,0);
    var a2 = cc.tintTo(0.025, 255,255,255);
    var a3 = cc.tintTo(0.025, 255,0,0);
    var a4 = cc.tintTo(0.025, 255,255,255);
    self.runAction(cc.sequence(a1,a2,a3,a4));
  },
  showHurtAnimation:function(){

  },
  onAttack:function(){

  },
  onHurt:function(){

  },
  onDeath:function(){

  }
});

var PlayerSprite = BattleSprite.extend({
  ctor:function(battle,data,type){
    BattleSprite.prototype.ctor.call(this,battle,data,type);
  },
  onAttack:function(){
    var self = this;
    var battle = self.battle;
    battle.damageEnemy(self.data.getAttack());
  },
  onDeath:function(){
    this.setVisible(false);
  }
});
var EnemySprite = BattleSprite.extend({
  ctor:function(battle,data,type){
    BattleSprite.prototype.ctor.call(this,battle,data,type);
  },
  onAttack:function(){
    var self = this;
    var battle = self.battle;
    battle.damagePlayer(self.data.getAttack());
  },
  onDeath:function(){
    this.setVisible(false);
  }
});

