var EFFECT_LIFE_VALUE = 'life_value';
var EFFECT_LIFE_RATE = 'life_rate';
var EFFECT_GLOBE_LIFE_VALUE = 'globe_life_value';
var EFFECT_GLOBE_LIFE_RATE = 'globe_life_rate';
var EFFECT_ATK_VALUE = 'atk_value';
var EFFECT_ATK_RATE = 'atk_rate';
var EFFECT_GLOBE_ATK_VALUE = 'globe_atk_value';
var EFFECT_GLOBE_ATK_RATE = 'globe_atk_rate';
var EFFECT_HIT_VALUE = 'hit_value';
var EFFECT_HIT_RATE = 'hit_rate';
var EFFECT_GLOBE_HIT_VALUE = 'globe_hit_value';
var EFFECT_GLOBE_HIT_RATE = 'globe_hit_rate';
var EFFECT_CTR_CHANCE = 'ctr_chance';
var EFFECT_CTR_RATE = 'ctr_modify';
var EFFECT_ATTACK_SPD = 'attack_spd';
var EFFECT_GOLD_BONUS = 'gold_bonus';

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
