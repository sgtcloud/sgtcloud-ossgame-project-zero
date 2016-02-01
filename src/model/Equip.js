var Equip = function (id, lv) {
    var id = id;
    var lv = lv;
    var data = dataSource.equips[id];
    this.getId = function () {
        return id;
    };
    this.getLv = function () {
        return lv;
    };

    this.getMaxLevel=function(){
        return data.levelDatas[0]['level'];
    };
    this.getName = function () {
        return data.name;
    };
    this.getIcon=function(){
        return data.icon;
    }
    this.getDesc = function () {
        return data.desc;
    };
    this.getLife = function () {
        return data.life_base + data.life_grow * (lv - 1);
    };
    this.getAttack = function () {
        return data.attack_base + data.attack_grow * (lv - 1);
    };
    this.getHit = function () {
        return data.hit_base + data.hit_grow * (lv - 1);
    };
    this.getPrice = function () {
        return this.getLevelData()['upgrade'];
    };
    this.getEffect = function (key) {
        return getEffectValue(data, key, lv);
    };
    this.upgrade = function (hero) {
        var price = this.getNextLevelUpgrade();
        var unit=price['unit']
        if (!validateAmountEnough(price)) {
            lv += 1;
            var cost={value:-price.value,unit:unit}
            PlayerData.updateResource([cost]);
            //game.onEquipUpdate(hero, this);
            //game.onHeroUpdate(hero);
            for (var i in player.heroes) {
                var cacheHero = player.heroes[i];
                if (cacheHero.id === heroId) {
                    cacheHero['equips'] = cacheHero['equips'] || {};
                    if (cacheHero['equips'] instanceof Array) {
                        cacheHero['equips'] = {};
                    }
                    cacheHero['equips'][this.getId()] = cacheHero['equips'][this.getId()] || {};
                    cacheHero['equips'][this.getId()]['level'] = lv;
                    break;
                }
            }
            PlayerData.updatePlayer();
        }
    };
    this.isMaxLevel = function () {
        return lv >= this.getMaxLevel();
    };

    this.getLevelData = function (level) {
        return getSpecificLevelData(data, level || lv);
    };
    this.getNextLevelUpgrade = function () {
        var level = this.getLv();
        var cost = getLevelData(data, 'upgrade', level + 1);
        return cost;
    };
    this.traverseEquipEffects = function (lv) {
        var equip = this.getLevelData(lv);
        var effects = [];
        for (var key in equip) {
            //狗日的微信浏览器中没有startsWith
            if (key.indexOf("effect") == 0) {
                var effect = equip[key];
                effect['name'] = key;
                effects.push(effect);
                effect.index = parseInt(key.replace("effect", ""));
            }
        }
        return effects.sort(function (a, b) {
            return a.index - b.index;
        });
    }
};

