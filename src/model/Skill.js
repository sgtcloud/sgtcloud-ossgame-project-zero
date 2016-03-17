/**
 * Created by highkay on 2015/12/29.
 */
var Skill = function (id, lv, heroId) {
    var id = id;
    var lv = lv;
    var data = dataSource.skills[id];
    var icon = data.icon;
    var type = data.type;
    //var unlockLevel = data['unlockLevel']
    var heroId = heroId;
    this.getIcon = function () {
        return icon;
    }
    this.getType = function(){
        return type;
    }
    this.getUnlockLevel = function () {
        return getLevelData(data, 'unlockLevel', this.getLv());
    }
    this.isLocked=function(){
        return this.getLv()<this.getUnlockLevel()
    }
    this.getType = function () {
        return type;
    }
    this.getId = function () {
        return id;
    };
    /**
     * 获取升下一级所需数据
     * @returns {*}
     */
    this.getNextLevelUpgrade = function () {
        var level = this.getLv();
        var cost = getLevelData(data, 'upgrade', level + 1);
        return cost;
    };
    this.getLevelData = function (level) {
        return getSpecificLevelData(data, level || lv);
    }
    /**
     * 是否最高级别
     * @returns {boolean} true 是，false 不是
     */
    this.isMaxLevel = function () {
        return lv >= this.getMaxLevel();
    };
    this.getMaxLevel = function () {
        return data.levelDatas[data.levelDatas.length-1]['level'];
    }
    this.upgrade = function () {
        lv++;
        /* for (var i = 0; i < PlayerData.getHeroesData(heroId).length; i++) {
         if (player.heroes[heroId]["id"] === this.getId()) {
         player.heroes[i]['lv']=lv;
         }
         }*/
        for (var i in player.heroes) {
            var cacheHero = player.heroes[i];
            if (cacheHero.id === heroId) {
                cacheHero['skills'] = cacheHero['skills'] || {};
                if (cacheHero['skills'] instanceof Array) {
                    cacheHero['skills'] = {};
                }
                cacheHero['skills'][this.getId()] = cacheHero['skills'][this.getId()] || {};
                cacheHero['skills'][this.getId()]['level'] = lv;
                break;
            }
        }

    }
    /**
     * 获取当前级别
     * @returns {int}
     */
    this.getLv = function () {
        return lv;
    };
    this.getName = function () {
        return data.name;
    };
    this.getDesc = function () {
        return data.desc;
    };
    this.getBuffDesc = function () {
        return data.buffDesc;
    };
    this.getPreShow = function(){
        return data.preShow;
    };
    this.getEffect = function (key) {
        return getEffectValue(data, key, lv);
    };
    this.isUseable = function () {
        return data.useable;
    }
    /**
     * 遍历制定级别的所有技能效果,按index正序排列
     * @param lv 级别，默认为当前级别
     * @returns [{type:'技能type','value':111,'index':'排列位置'}]
     */
    this.traverseSkillEffects = function (lv) {
        lv=lv||this.getLv();
        var levelData = this.getLevelData(lv);
        var effects = [];
        for (var key in levelData) {
            //狗日的微信浏览器中没有startsWith
            if (key.indexOf("effect") == 0) {
                var effect = $$.extend(levelData[key],{'name':key,'index':parseInt(key.replace("effect", ""))});
                /*for(var i in levelData[key]){
                    effect[i]=levelData[key][i]
                }*/
                if (lv === 0) {
                    effect['value'] = 0;
                }
                effects.push(effect);
                //effect['name'] = key;
                //effect.index = parseInt(key.replace("effect", ""));
            }
        }
        return effects.sort(function (a, b) {
            return a.index - b.index;
        });
    }
}