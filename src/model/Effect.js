var AFFECT_LIFE_VALUE = 'life_value';
var AFFECT_LIFE_MODIFY = 'life_modify';
var AFFECT_ATTACK_VALUE = 'attack_value';
var AFFECT_ATTACK_MODIFY = 'attack_modify';
var AFFECT_HIT_VALUE = 'hit_value';
var AFFECT_HIT_MODIFY = 'hit_modify';
var AFFECT_CTR_CHANCE = 'ctr_chance';
var AFFECT_CTR_MODIFY = 'ctr_modify';
var AFFECT_ATTACK_SPD = 'attack_spd';
var AFFECT_GOLD_BONUS = 'gold_bonus';

var Effect = function(){
  var data = {};

  this.get = function(tag){
    var val = data[tag];
    if(val){
      return val;
    }
    return 0;
  };

  this.getLifeValue = function(){
    var val = data['life_value'];
    if(val){
      return val;
    }
    return 0;
  };
  this.getLifeModify = function(){
    var val = data['life_modify'];
    if(val){
      return val;
    }
    return 0;
  };

  this.getAttackValue = function(){
    var val = data['attack_value'];
    if(val){
      return val;
    }
    return 0;
  };
  this.getAttackModify = function(){
    var val = data['attack_modify'];
    if(val){
      return val;
    }
    return 0;
  };
  this.getHitValue = function(){
    var val = data['hit_value'];
    if(val){
      return val;
    }
    return 0;
  };
  this.get
};
