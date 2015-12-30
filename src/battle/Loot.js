/**
 * Created by highkay on 2015/12/30.
 */

//掉落物品
var Loot = cc.Node.extend({

    ctor: function (unit, val) {
        this._super();

        this.appear = cc.jumpBy(0.2, cc.p(Math.random() * 10 - 10, 0), 24, 1);
        this.shine = cc.delayTime(1.0);
        //this.disapper = cc.fadeOut(1.0);
        var self = this;
        this.count = cc.callFunc(function () {
            //cc.pool.putInPool(this);
            self.removeFromParent(true);
            PlayerData.consumeResource([PlayerData.createResourceData(this.unit, this.value)]);
            cc.log(player.gold);
        }, this);
        this.initData(unit, val);
        //this.reuse(unit, val);
    },

    initData: function (unit, val) {
        this.unit = unit;
        this.value = val;
        if (unit == "gold") {
            if (val < 100) {
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
        this.addChild(this.lootSprite);
    },

    //unuse: function () {
    //    //this.setVisible(false);
    //    this.removeChild(this.lootSprite);
    //},
    //
    //reuse: function (unit, value) {
    //    this.initData(unit, value);
    //    //this.lootSprite.runAction(this.action);
    //    this.addChild(this.lootSprite);
    //    //this.setVisible(true);
    //},

    setOpacity: function (op) {
        if (this.lootSprite) {
            this.lootSprite.setOpacity(op);
        }
    },

    fire: function () {
        this.lootSprite.runAction(this.action);
        this.action.play("shine", true);
        var startPos = this.getPosition();
        var movePath = [startPos,
            cc.p(320, 480),
            cc.p(320, 280)];
        this.move = cc.bezierTo(0.6, movePath);
        this.runAction(cc.sequence(this.appear, this.shine, this.move, this.count));
        //this.delay = cc.delayTime(1.5);
        //this.runAction(cc.sequence(this.delay, this.disapper));
    }
});

// 重用对象
//Loot.createFromPool = function (val, ctr) {
//    var pool = cc.pool;
//    if (pool.hasObject(Loot)) {
//        return pool.getFromPool(Loot, val, ctr);
//    } else {
//        return new Loot(val, ctr);
//    }
//};

// 初始化对象32个放入池中
//Loot.initPool = function () {
//    for (var i = 0; i < 32; i++) {
//        cc.pool.putInPool(new Loot());
//    }
//};
//Loot.initPool();