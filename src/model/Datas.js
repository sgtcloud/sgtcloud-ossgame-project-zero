var datas = {};
function initDatas(){
  datas.heros = cc.loader.getRes(res.heros_json);
  datas.enemys = cc.loader.getRes(res.enemys_json);
  datas.battles = cc.loader.getRes(res.battles_json);
  datas.equips = cc.loader.getRes(res.equips_json);
}
