/**
 * Created by highkay on 2015/12/30.
 */

//掉落物品
var Loot = cc.Node.extend({

    ctor: function (unit, size, bonus) {
        this._super();
        this.initData(unit, size);
        this.bonus = bonus;
        //this.reuse(unit, val);
    },

    initData: function (unit, size) {
        this.unit = unit;
        if (unit === "gold") {
            if (size === "little") {
                this.lootSprite = ccs.load(res.little_gold_json).node;
                this.action = ccs.load(res.little_gold_json).action;
            } else if (size === "some") {
                this.lootSprite = ccs.load(res.some_gold_json).node;
                this.action = ccs.load(res.some_gold_json).action;
            } else if (size === "amount") {
                this.lootSprite = ccs.load(res.amount_gold_json).node;
                this.action = ccs.load(res.amount_gold_json).action;
            } else if (size === "huge"){
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

    //setPosition: function (pos, y) {
    //    cc.Node.prototype.setPosition.call(this, pos, y);
    //    if (this.lootSprite && this.getParent()) {
    //        //var thispos = this.getParent().getPosition();
    //        this.lootSprite.setPosition(pos, y);
    //    }
    //},

    setOpacity: function (op) {
        if (this.lootSprite) {
            this.lootSprite.setOpacity(op);
        }
    },

    fire: function () {
        var battlePanel = this.getParent();
        if (battlePanel) {
            var jumpPos = cc.p(Math.random() * 108 - 54, Math.random() * 32 - 16);
            this.appear = cc.jumpBy(0.2, jumpPos, 24, 1);
            this.shine = cc.delayTime(1.0);
            //this.disapper = cc.fadeOut(1.0);
            var self = this;
            this.count = cc.callFunc(function () {
                //cc.pool.putInPool(this);
                self.removeFromParent(true);
                if (self.bonus) {
                    PlayerData.updateResource([PlayerData.createResourceData(self.bonus.unit, self.bonus.value)]);
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                }
                //cc.log(player.gold);
            }, this);
            var startPos = this.getPosition();

            // todo 钥匙和宝箱的逻辑
            if (this.unit === "gold") {
                var endPosition = this.getGoldPosition() || cc.p(320, 280);
            } else if (this.unit === "gem") {
                var endPosition = this.getDiamondPosition() || cc.p(320, 280);
            } else if (this.unit === "relic") {
                var endPosition = this.getRelicPosition() || cc.p(320, 280);
            } else if (this.unit === "key") {
                var endPosition = this.getGoldPosition() || cc.p(320, 280);
            }
            var curveValue = cc.p(300 + Math.random() * 40, 400 + Math.random() * 80);
            //var curveValue =  cc.p(320, 280);
            //var endPosition = cc.p(320, 280);
            var movePath = [startPos,
                curveValue,
                endPosition];
            this.move = cc.bezierTo(0.75, movePath);
            this.lootSprite.runAction(this.action);
            this.action.play("shine", true);
            this.moveUpAndBecomeBigger = cc.spawn(cc.moveBy(0.1, 0, 16), cc.scaleBy(0.1, 1.5));
            this.runAction(cc.sequence(this.appear, this.shine, this.moveUpAndBecomeBigger, this.move, this.count));
        }
    }
});

Loot.generateLoots = function (bonusSrc, pos) {
    var lootSprites = [];
    if (bonusSrc.unit === "gold") {
        var bonus = {unit: bonusSrc.unit, value: bonusSrc.value};
        bonus.value = bonus.value * (1 + PlayerData.globe_gold_rate / 100);
        if (bonus.value == 1) {
            lootSprites.push(new Loot(bonus.unit, "little"));
        } else if (bonus.value > 1 && bonus.value <= 5) {
            this.createLootSprites(lootSprites, 3, "little", bonus);
        } else if (bonus.value > 5 && bonus.value <= 10) {
            this.createLootSprites(lootSprites, 5, "little", bonus);
        } else if (bonus.value > 10 && bonus.value <= 50) {
            lootSprites.push(new Loot(bonus.unit, "some"));
            this.createLootSprites(lootSprites, 10, "little", bonus);
        } else if (bonus.value > 50 && bonus.value <= 100) {
            lootSprites.push(new Loot(bonus.unit, "amount"));
            this.createLootSprites(lootSprites, 5, "little", bonus);
        } else if (bonus.value > 100 && bonus.value <= 500) {
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 10, "little", bonus);
        } else if (bonus.value > 500 && bonus.value <= 1000) {
            lootSprites.push(new Loot(bonus.unit, "some"));
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 15, "little", bonus);
        } else if (bonus.value > 1000 && bonus.value <= 5000) {
            lootSprites.push(new Loot(bonus.unit, "amout"));
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 20, "little", bonus);
        } else {
            lootSprites.push(new Loot(bonus.unit, "some"));
            lootSprites.push(new Loot(bonus.unit, "amout"));
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 20, "little", bonus);
        }
    }

    for (var i in lootSprites) {
        // 跨panel的移动逻辑需要添加到scene中
        lootSprites[i].setPosition(pos);
        cc.director.getRunningScene().addChild(lootSprites[i]);
        lootSprites[i].fire();
    }
};
Loot.createLootSprites = function (lootSprites, num, size, bonus) {
    for (var i = 0; i < num; i++) {
        lootSprites.push(new Loot(bonus.unit, size));
        if (i == num - 1) {
            lootSprites.push(new Loot(bonus.unit, size, bonus));
        }
    }
}

// 重用对象
//Loot.create = function (val, ctr) {
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