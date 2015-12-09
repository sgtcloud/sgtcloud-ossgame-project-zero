var Enemy = function(src){
  var id = src.id;
  var lv = src.lv;
  var data = datas.enemys[id];

  this.getId = function(){
    return id;
  }
  this.getLv = function(){
    return lv;
  }
  this.getName = function(){
    return data.name;
  }
  this.getFile = function(){
    return data.file;
  }
  this.getLife = function(){
    return getProperValue(data.life,lv-1);
  }
  this.getAttack = function(){
    return getProperValue(data.attack,lv-1);
  }
  this.getAnimateDelay = function(){
    return data.animate;
  }
}


var Battle = function(src){
  var enemys = [];
  for(var i in src){
    enemys[i] = new Enemy(src[i]);
  }
  this.change = function(src){

  }
  this.getEnemyCount = function(){
    return enemys.length;
  }
  this.getEnemyData = function(i){
    return enemys[i];
  }
  this.getEnemysLife = function(){
    var life = 0;
    for(var i=0;i<enemys.length;i++){
      life += enemys[i].getLife();
    }
    return life;
  }

}
var Stage = function(src){
  var id = src.id;
  var state = src.state;
  var auto = src.auto;
  var data = datas.stages[id];
  var battles = [];
  for(var i=0;i<data.battles.length;i++){
    battles[i] = new Battle(data.battles[i]);
  }

  this.change = function(){

  }
  this.getId = function(){
    return id;
  }
  this.getBattleCount = function(){
    return battles.length;
  }
  this.getBattleData = function(i){
    return battles[i];
  }
  this.getBattleState = function(){
    return state;
  }
  this.getCurrentBattle = function(){
    return this.getBattleData(state);
  }
  this.isBossBattle = function(){
    return state >= battles.length-1;
  }
  this.isLastBattle = function(){
    return state == battles.length-2;
  }
  this.isAutoBoss = function(){
    return auto;
  }
  this.hasNextBattle = function() {
    return state < battles.length - 1;
  }
  this.goNextBattle = function(){
    if(this.hasNextBattle()){
      state += 1;
      return true;
    }
    return false;
  }
  this.goPrevBattle = function(){
    if(!this.hasNextBattle()){
      state -= 1;
      return true;
    }
    return false;
  }
}

// var Battle  = function(src){
//   var id = src.stage;
//   var state = src.state;
//   var boss = src.boss;
//   var data = datas.battles[id];
//   var enemys = [];
//   for(var i in data.enemys){
//     enemys[i] = new Enemy(data.enemys[i]);
//   }
//   return {
//     img:function(){
//       return data.img;
//     },
//     getEnemys:function(){
//       return enemys;
//     },
//     getEnemy:function(index){
//       return enemys[index];
//     },
//     getEnemyCount:function(){
//       return enemys.length;
//     },
//     getEnemysLife:function(){
//       var life = 0;
//       for(var i=0;i<enemys.length;i++){
//         life += enemys[i].getLife();
//       }
//       return life;
//     },
//     getStage:function(){
//       return stage;
//     },
//     getState:function(){
//       return state;
//     },
//     getNext:function(){
//       return data.next;
//     },
//     getId:function(){
//       return id;
//     },
//     setId:function(newId){
//       id = newId;
//       state = 0;
//       data = datas.battles[id];
//       var enemys = [];
//       for(var i in data.enemys){
//         enemys[i] = new Enemy(data.enemys[i]);
//       }
//     },
//     change:function(next){
//       id = next;
//       data = datas.battles[id];
//       enemys = [];
//       for(var i in data.enemys){
//         enemys[i] = new Enemy(data.enemys[i]);
//       }
//     },
//     reset:function(){
//       this.change(id);
//     },
//     load:function(src){
//       id = src.id;
//       state = src.state;
//       data = data.battles[id];
//       enemys = [];
//       for(var i in data.battles[id].enemys){
//         enemys[i] = new Enemy(datas.battles[id].enemys[i]);
//       }
//     }
//   };
// }
