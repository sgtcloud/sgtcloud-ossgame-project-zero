var dataSource = {};
function initDatas() {
    dataSource.heros = cc.loader.getRes(res_datas.heroes_json);
    dataSource.enemys = cc.loader.getRes(res_datas.enemies_json);
    dataSource.stages = cc.loader.getRes(res_datas.stages_json);
    dataSource.equips = cc.loader.getRes(res_datas.equips_json);
    dataSource.skills = cc.loader.getRes(res_datas.skills_json);
}


function getLevelData(data, key, lv) {
    if (!data) {
        return undefined;
    }
    if (!data.levelDatas) {
        return undefined;
    }
    if (!data.levelDatas[lv]) {
        return data.levelDatas[0][key];
    }
    var len=data.levelDatas.length;
    return data.levelDatas[len-lv][key];
}

function getAffectValue(data, key, lv) {
    var val = getLevelData(data, key, lv);
    if (!val) {
        return 0;
    }
    return val;
}

