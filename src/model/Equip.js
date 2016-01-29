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
        return data.price_base + data.price_grow * (lv - 1);
    };
    this.getEffect = function (key) {
        return getEffectValue(data, key, lv);
    };
    this.upgrade = function (hero) {
        var price = this.getPrice();
        if (player.gold >= price) {
            lv += 1;
            PlayerData.consumeResource(PlayerData.createResourceData("gold", -price));
            game.onEquipUpdate(hero, this);
            game.onHeroUpdate(hero);
        }
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

