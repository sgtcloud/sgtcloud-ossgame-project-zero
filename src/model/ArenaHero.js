var ArenaHero = Hero.extend({
    ctor: function (heroData, playerId) {
        this.init(heroData);
        this._playerId = playerId;
        this.initLife();
        this.refreshProps();
    },
    initLife: function () {
        this._heroData.life = this.getLife();
    }, isDead: function () {
        return  !this.getCurrentLife() > 0;
    },
    _validateLocked: function (unlock) {
        if (unlock) {
            var unit = unlock['unit'];
            var value = unlock['value'];
            switch (unit) {
                case 'hero':
                    var hero = PlayerData.create(this._playerId).getHeroById(value);
                    return hero.getLv() < 1;
                default:
            }
        }
        return false;
    },
    calcProp: function (propName, lvData) {
        var val = 0;
        var tmpVal = 0;
        var rate = 1.0;
        tmpVal = lvData || getLevelData(this._data, propName, this.getLv());
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = this[propName + "_value"];
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = PlayerData.create(this._playerId)["globe_" + propName + "_value"];
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = this[propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal / 100;
        }
        tmpVal = PlayerData.create(this._playerId)["globe_" + propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal / 100;
        }
        tmpVal = PlayerData.create(this._playerId)["tmp_" + propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal / 100;
        }
        if (propName === "atk_period") {
            return val / rate;
        } else {
            return val * rate;
        }
    }
});
