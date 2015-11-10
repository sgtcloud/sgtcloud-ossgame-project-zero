var Enemy = function(src){
  var id = src.id;
  var lv = src.lv;
  var data = datas.enemys[id];
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
    img:function(){
      return data.img;
    },
    getLife:function(){
      return data.life_base + data.life_grow * (lv-1);
    },
    getAttack:function(){
      return data.attack_base + data.attack_grow * (lv-1);
    },
    getAnimateDelay:function(){
      return data.animate;
    }
  };
}
