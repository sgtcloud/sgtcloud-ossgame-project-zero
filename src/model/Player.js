
var Player = function(src){
  var id = src.id;
  var name = src.name;
  var gold = src.gold;
  var gem = src.gem;
  var vip = src.vip;
  var battle = new Battle(src.battle);
  var heros = [];
  for(var i in src.heros){
    heros[i] = new Hero(src.heros[i]);
  }

  return {
    getId:function(){
      return id;
    },
    getName:function(){
      return name;
    },
    getBattle:function(){
      return battle;
    },
    getHeros:function(){
      return heros;
    },
    getHero:function(id){
      return heros[id];
    },
    getLife:function(){
      var val = 0;
      for(var i in heros){
        var hero = heros[i];
        val += hero.getLife();
      }
      return val;
    },
    getAttack:function(){
      var val = 0;
      for(var i in heros){
        var hero = heros[i];
        val += hero.getAttack();
      }
      return val;
    },
    getHit:function(){
      var val = 0;
      for(var i in heros){
        var hero = heros[i];
        val += hero.getHit();
      }
      return val;
    },
    getGold:function(){
      return gold;
    },
    getGem:function(){
      return gem;
    },
    getVip:function(){
      return vip;
    },
    changeGold:function(price){
      gold += price;
    },
    notifyStateWin:function(){
      var bonus = battle.getBonus(battle.getState());
      gold += bonus;
    },
    notifyBattleWin:function(){

    }
  };
}
