
var Hero  = function(record){
  var id = record.id;
  var lv = record.lv;
  var state = record.state;
  var data = datas.heros[id];
  var equips = [];

  for(var i in record.equips){
    var equip = data.equips[i];
    var lv = record.equips[i];
    equips[i] = new Equip(equip,lv);

  }
  // console.log(equips);
  return {
    getId:function(){
      return id;
    },
    getLv:function(){
      return lv;
    },
    getName:function(){
      return data.name;
    },
    getPrice:function(){
      return data.price_base + data.price_grow * (lv-1);
    },
    getState:function(){
      return state;
    },
    getEquips:function(){
      return equips;
    },
    getEquip:function(index){
      return equips[index];
    },
    getLife:function(){
      var val = data.life_base;
      val += data.life_grow * (lv-1);
      for(var i in equips){
        val += equips[i].getLife();
      }
      return val;
    },
    getAttack:function(){
      var val = data.attack_base;
      val += data.attack_grow * (lv-1);
      for(var i in equips){
        val += equips[i].getAttack();
      }
      return val;
    },
    getHit:function(){
      var val = data.hit_base;
      val += data.hit_grow * (lv-1);
      for(var i in equips){
        val += equips[i].getHit();
      }
      return val;
    },
    getAnimateDelay:function(){
      return data.animate;
    },
    upgrade:function(){
      var price = this.getPrice();
      if(player.getGold() >= price){
        lv += 1;
        player.changeGold(-price);
        game.onHeroUpdate(this);
      }
    }
  };
}
