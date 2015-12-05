var datas = {};
function initDatas(){
  datas.heros = cc.loader.getRes(res_datas.heros_json);
  datas.enemys = cc.loader.getRes(res_datas.enemys_json);
  datas.battles = cc.loader.getRes(res_datas.battles_json);
  datas.stages = cc.loader.getRes(res_datas.stages_json);
  datas.equips = cc.loader.getRes(res_datas.equips_json);
  datas.skills = cc.loader.getRes(res_datas.skills_json);
}

function getProperValue(values,index){
  var i = Math.max(index,values.length-1);
  return values[i];
}

var DataListener = function(){

}
