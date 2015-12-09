var BattleConsts = {};
BattleConsts.Camp = {
  Player:0,
  Enemy:1
};

function getLevelData(data,key,lv){
    if(!data.levelDatas){
        return undefined;
    }
    if(!data.levelDatas[lv]){
        return data.levelDatas[0][key];
    }
    return data.levelDatas[lv][key];
}
