var datas = {};
function initDatas(){
  datas.heros = cc.loader.getRes(res_datas.heros_json);
  datas.enemys = cc.loader.getRes(res_datas.enemys_json);
  datas.battles = cc.loader.getRes(res_datas.battles_json);
  datas.stages = cc.loader.getRes(res_datas.stages_json);
  datas.equips = cc.loader.getRes(res_datas.equips_json);
  datas.skills = cc.loader.getRes(res_datas.skills_json);
}


function getLevelData(data,key,lv){
    if(!data){
        return undefined;
    }
    if(!data.levelDatas){
        return undefined;
    }
    if(!data.levelDatas[lv]){
        return data.levelDatas[0][key];
    }
    return data.levelDatas[lv][key];
}

function getAffectValue(data,key,lv){
    var val = getLevelData(data,key,lv);
    if(!val){
        return 0;
    }
    return val;
}

