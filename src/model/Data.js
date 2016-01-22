var dataSource = {};
function initDatas() {
    dataSource.heros = cc.loader.getRes(res_datas.heroes_json);
    dataSource.enemys = cc.loader.getRes(res_datas.enemies_json);
    dataSource.stages = cc.loader.getRes(res_datas.stages_json);
    dataSource.equips = cc.loader.getRes(res_datas.equips_json);
    dataSource.skills = cc.loader.getRes(res_datas.skills_json);
    dataSource.goods = cc.loader.getRes(res_datas.goods_json);
    dataSource.players = cc.loader.getRes(res_datas.players_json);
    dataSource.bonus = cc.loader.getRes(res_datas.bonus_json);
}


function getLevelData(data, key, lv) {
    if (!data) {
        return undefined;
    }
    if (!data.levelDatas) {
        return undefined;
    }
    var result;
    var len=data.levelDatas.length;
    var index=len-lv;
    if (!data.levelDatas[index]) {
        result= data.levelDatas[len-1][key];
    }else {
        result= data.levelDatas[index][key];
    }
    if(cc.isObject(result)){
        return $$.extend(result)
    }
    return result;
}

function  getSpecificLevelData(data,level){
    var len=data.levelDatas.length;
    if(level==0){
         var rs=data.levelDatas[len-1];
        return rs
    }
    var index=len-level;
    if (!data.levelDatas[index]) {
        return data.levelDatas[len-1];
    }
    return data.levelDatas[index];
}

function getEffectValue(data, key, lv) {
    var val = getLevelData(data, key, lv);
    if (!val) {
        return 0;
    }
    return val;
}

