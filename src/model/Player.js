
var Player = function(src){
  var id = src.id;
  var name = src.name;
  var gold = src.gold;
  var gem = src.gem;
  var relic = src.relic;
  var vip = src.vip;
  var stage = new Stage(src.stage);
  var heros = [];
  for(var i in src.heros){
    heros[i] = new Hero(src.heros[i]);
  }

  this.getId = function(){
    return id;
  }

  this.getName = function(){
    return name;
  }

  this.getHeroCount = function(){
    return heros.length;
  }
  this.getHeroData = function(id){
    return heros[id];
  }
  this.getStageData = function(){
    return stage;
  }

  this.getLife = function(){
    var val = 0;
    for(var i in heros){
      var hero = heros[i];
      val += hero.getLife();
    }
    return val;
  }
  this.getAttack = function(){
    var val = 0;
    for(var i in heros){
      var hero = heros[i];
      val += hero.getAttack();
    }
    return val;
  }
  this.getHit = function(){
    var val = 0;
    for(var i in heros){
      var hero = heros[i];
      val += hero.getHit();
    }
    return val;
  }
  this.getGold = function(){
    return gold;
  }
  this.getGem = function(){
    return gem;
  }
  this.getRelic = function(){
    return relic;
  }
  this.getVip = function(){
    return vip;
  }

  this.changeGold = function(val){
    gold += val;
    if(gold < 0){
      gold = 0;
    }
  }

  this.changeStage = function(id){

  }

  // return {
  //   changeGold:function(price){
  //     gold += price;
  //   },
  //   notifyStateWin:function(){
  //     var bonus = battle.getBonus(battle.getState());
  //     gold += bonus;
  //   },
  //   notifyBattleWin:function(){
  //
  //   }
  // };
}
