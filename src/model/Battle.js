var Battle  = function(src){
  var id = src.id;
  var state = src.state;
  var data = datas.battles[id];
  var enemys = [];
  for(var i in data.enemys){
    enemys[i] = new Enemy(data.enemys[i]);
  }
  return {
    img:function(){
      return data.img;
    },
    getEnemys:function(){
      return enemys;
    },
    getEnemy:function(state){
      return enemys[state];
    },
    getBonus:function(state){
      return data.enemys[state].gold;
    },
    getState:function(){
      return state;
    },
    getId:function(){
      return id;
    },
    setId:function(newId){
      id = newId;
      state = 0;
      data = datas.battles[id];
      var enemys = [];
      for(var i in data.enemys){
        enemys[i] = new Enemy(data.enemys[i]);
      }
    },
    nextState:function(){
      if(state < enemys.length-1){
        state += 1;
      }
    },
    load:function(src){
      id = src.id;
      state = src.state;
      data = data.battles[id];
      enemys = [];
      for(var i in data.battles[id].enemys){
        enemys[i] = new Enemy(datas.battles[id].enemys[i]);
      }
    }
  };
}
