var dataSource = {};
function initDatas() {
    dataSource.heros = cc.loader.getRes(res_datas.heroes_json);
    dataSource.enemys = cc.loader.getRes(res_datas.enemies_json);
    dataSource.stages = cc.loader.getRes(res_datas.stages_json);
    dataSource.equips = cc.loader.getRes(res_datas.equips_json);
    dataSource.skills = cc.loader.getRes(res_datas.skills_json);
    dataSource.goods = cc.loader.getRes(res_datas.goods_json);
    dataSource.players = cc.loader.getRes(res_datas.players_json);
    dataSource.constant = cc.loader.getRes(res_datas.constant_json);
}


function getLevelData(data, key, lv) {
    if (!data) {
        return undefined;
    }
    if (!data.levelDatas) {
        return undefined;
    }
    var len=data.levelDatas.length;
    var index=len-lv;
    if (!data.levelDatas[index]) {
        return data.levelDatas[len-1][key];
    }
    return data.levelDatas[index][key];
}

function  getSpecificLevelData(data,level){
    var len=data.levelDatas.length;
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

