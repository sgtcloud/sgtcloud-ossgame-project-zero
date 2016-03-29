var ArenaHero = Hero.extend({
    ctor: function (heroData, playerData) {
        this.init(heroData);
        this._playerData = playerData;
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
                    var hero = this._playerData.getHeroById(value);
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
        tmpVal = this._playerData["globe_" + propName + "_value"];
        if (tmpVal) {
            val += tmpVal;
        }
        tmpVal = this[propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal / 100;
        }
        tmpVal = this._playerData["globe_" + propName + "_rate"];
        if (tmpVal) {
            rate += tmpVal / 100;
        }
        tmpVal = this._playerData["tmp_" + propName + "_rate"];
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
