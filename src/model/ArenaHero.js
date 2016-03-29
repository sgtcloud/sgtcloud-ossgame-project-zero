var ArenaHero = Hero.extend({
    ctor: function (heroData, playerData) {
        this._super(heroData);
        this._playerData = playerData;
        this.initLife();
    },
    initLife: function () {
        this._heroData.life = this.getLife();
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
