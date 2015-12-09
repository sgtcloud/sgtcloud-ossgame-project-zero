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
    return getLevelData(data,"life",lv);
  }
  this.getAttack = function(){
    return getLevelData(data,"attack",lv);
  }
  this.getAnimateDelay = function(){
    return getLevelData(data,"atk_period",lv);
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
