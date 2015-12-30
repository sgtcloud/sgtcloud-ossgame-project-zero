/**
 * Created by highkay on 2015/12/30.
 */

//伤害数字类
var Loot = cc.Node.extend({

    unit: null,
    value: 0,

    ctor: function (unit, val) {
        this._super();

        this.appear = cc.fadeIn(0.5);
        this.shine = cc.delayTime(2);
        this.disapper = cc.fadeOut(0.5);
        this.count = cc.callFunc(function () {
            this.removeFromParent(true);
            cc.pool.putInPool(this);
            PlayerData.consumeResource(PlayerData.createResourceData(this.unit, this.value));
        }, this);
        this.initData(unit, val);
    },

    initData: function (unit, val) {
        this.unit = unit;
        this.value = val;
        if (unit == "gold") {
            if (val < 200) {
                this.lootSprite = ccs.load(res.little_gold_json).node;
                this.action = ccs.load(res.little_gold_json).action;
            } else if (val < 500) {
                this.lootSprite = ccs.load(res.some_gold_json).node;
                this.action = ccs.load(res.some_gold_json).action;
            } else if (val < 1000) {
                this.lootSprite = ccs.load(res.amount_gold_json).node;
                this.action = ccs.load(res.amount_gold_json).action;
            } else {
                this.lootSprite = ccs.load(res.huge_gold_json).node;
                this.action = ccs.load(res.huge_gold_json).action;
            }
        }
    },

    unuse: function () {
        //this.setVisible(false);
        this.removeChild(this.lootSprite);
    },

    reuse: function (unit, value) {
        this.initData(unit, value);
        this.lootSprite.runAction(this.action);
        this.addChild(this.lootSprite);
        //this.setVisible(true);
    },

    fire: function () {
        var movePath = [this.getParent().getPosition(),
            cc.p(360, 300),
            cc.p(320, 200)];
        this.move = cc.bezierTo(3, movePath);
        this.runAction(cc.sequence(this.appear, this.shine, this.move, this.disapper, this.count));
    }
});

// 重用对象
Loot.createFromPool = function (val, ctr) {
    var pool = cc.pool;
    if (pool.hasObject(Loot)) {
        return pool.getFromPool(Loot, val, ctr);
    } else {
        return new Loot(val, ctr);
    }
};

// 初始化对象32个放入池中
Loot.initPool = function () {
    for (var i = 0; i < 32; i++) {
        cc.pool.putInPool(new Loot());
    }
};