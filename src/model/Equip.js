var Equip = cc.Class.extend({
    ctor: function (id, equipCache) {
        this._id = id;
        this._lv = 0;
        this._data = dataSource.equips[this._id];
        var equipLv = equipCache && equipCache['level'];
        if (equipLv) {
            this._lv = equipLv;
        } else {
            if (this._data['type'] > 0) {
                this._lv = 0;
            } else {
                this._lv = 1;
            }
        }
    },
    getType: function () {
        return this._data['type'];
    },
    getId: function () {
        return this._id;
    },
    getLv: function () {
        return this._lv;
    },

    getMaxLevel: function () {
        return this._data.levelDatas[this._data.levelDatas.length - 1]['level'];
    },
    getName: function () {
        return this._data.name;
    },
    getIcon: function () {
        return this._data.icon;
    },
    getDesc: function () {
        return this._data.desc;
    },
    getLife: function () {
        return this._data.life_base + this._data.life_grow * (this._lv - 1);
    }
    , getAttack: function () {
        return this._data.attack_base + this._data.attack_grow * (this._lv - 1);
    }
    , getHit: function () {
        return this._data.hit_base + this._data.hit_grow * (this._lv - 1)
    }
    , getPrice: function () {
        return this.getLevelData()['upgrade'];
    }
    , getEffect: function (key) {
        return getEffectValue(this._data, key, this._lv);
    }
    , upgrade: function (hero, price) {
        price = price || this.getNextLevelUpgrade();
        var unit = price['unit'];
        if (!validateAmountNotEnough(price)) {
            this._lv += 1;
            var cost = {value: -price.value, unit: unit};
            PlayerData.updateResource(cost);
            //game.onEquipUpdate(hero, this);
            //game.onHeroUpdate(hero);
            customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, cost);
            for (var i in player.heroes) {
                var cacheHero = player.heroes[i];
                if (cacheHero.id === hero.getId()) {
                    cacheHero['equips'] = cacheHero['equips'] || {};
                    if (cacheHero['equips'] instanceof Array) {
                        cacheHero['equips'] = {};
                    }
                    cacheHero['equips'][this.getId()] = cacheHero['equips'][this.getId()] || {};
                    cacheHero['equips'][this.getId()]['level'] = this._lv;
                    break;
                }
            }
            PlayerData.updatePlayer();
        }
    }
    , isMaxLevel: function () {
        return this.getLv() >= this.getMaxLevel();
    }

    , getLevelData: function (level) {
        return getSpecificLevelData(this._data, level || this._lv);
    }
    ,getLevelUpgrade: function (lv) {
        return getLevelData(this._data, 'upgrade', lv);
    }
    , getNextLevelUpgrade: function () {
        var level = this.getLv();
        var cost = getLevelData(this._data, 'upgrade', level + 1);
        return cost;
    }
    , getUnlockLevel: function (lv) {
        return getLevelData(this._data, 'unlockLevel', lv||this.getLv());
    }
    , traverseEquipEffects: function (lv) {
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
});

