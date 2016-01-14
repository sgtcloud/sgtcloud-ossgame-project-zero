var Equip = function (id, lv) {
    var id = id;
    var lv = lv;
    var data = dataSource.equips[id];
    return {
        getId: function () {
            return id;
        },
        getLv: function () {
            return lv;
        },
        getName: function () {
            return data.name;
        },
        getDesc: function () {
            return data.desc;
        },
        getLife: function () {
            return data.life_base + data.life_grow * (lv - 1);
        },
        getAttack: function () {
            return data.attack_base + data.attack_grow * (lv - 1);
        },
        getHit: function () {
            return data.hit_base + data.hit_grow * (lv - 1);
        },
        getPrice: function () {
            return data.price_base + data.price_grow * (lv - 1);
        },
        getEffect: function (key) {
            return getEffectValue(data, key, lv);
        },
        upgrade: function (hero) {
            var price = this.getPrice();
            if (PlayerData.getAmountByUnit("gold") >= price) {
                lv += 1;
                PlayerData.updateResource(PlayerData.createResourceData("gold", -price));
                game.onEquipUpdate(hero, this);
                game.onHeroUpdate(hero);
            }
        },

        getLevelData: function (level) {
            return getSpecificLevelData(data, level || lv);
        },
        traverseEquipEffects: function (lv) {
            var equip = this.getLevelData(lv);
            var effects = [];
            for (var key in equip) {
                //狗日的微信浏览器中没有startsWith
                if (key.indexOf("effect") == 0) {
                    var effect = equip[key];
                    effects.push(effect);
                    effect.index = parseInt(key.replace("effect", ""));
                }
            }
            return effects.sort(function (a, b) {
                return a.index - b.index;
            });
        }
    };
};

