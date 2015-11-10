var Equip = function(id,lv){
  var id = id;
  var lv = lv;
  var data = datas.equips[id];
  return {
    getId:function(){
      return id;
    },
    getName:function(){
      return data.name;
    },
    getLife:function(){
      return data.life_base + data.life_grow * (lv-1);
    },
    getAttack:function(){
      return data.attack_base + data.attack_grow * (lv-1);
    },
    getHit:function(){
      return data.hit_base + data.hit_grow * (lv-1);
    },
    getPrice:function(){
      return data.price_base + data.price_grow * (lv-1);
    },
    upgrade:function(hero){
      var price = this.getPrice();
      if(player.getGold() >= price){
        lv += 1;
        player.changeGold(-price);
        game.onEquipUpdate(hero,this);
        game.onHeroUpdate(hero);
      }
    }
  };
}
