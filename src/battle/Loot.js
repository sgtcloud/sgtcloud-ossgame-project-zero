/**
 * 掉落vm类
 *
 * Created by highkay on 2015/12/30.
 */
var Loot = CCSUnit.extend({

    ctor: function (unit, size, bonus) {
        this._super();
        this.bonus = bonus;
        this.initData(unit, size);
        //this.reuse(unit, val);
    },

    initData: function (unit, size) {
        this.unit = unit;
        if (unit === "gold") {
            if (size === "little") {
                this.initSprite(res.little_gold_json);
            } else if (size === "some") {
                this.initSprite(res.some_gold_json);
            } else if (size === "amount") {
                this.initSprite(res.amount_gold_json);
            } else if (size === "huge") {
                this.initSprite(res.huge_gold_json);
            }
        } else {
            this.initSprite(res[unit + "_json"]);
        }
        this.playAnimation("shine", true);
    },

    onEnter: function () {
        this._super();
        var jumpPos = cc.p(Math.random() * 108 - 54, Math.random() * 32 - 16);
        this.appear = cc.jumpBy(0.2, jumpPos, 24, 1);
        this.shine = cc.delayTime(1.0);
        this.count = cc.callFunc(function () {
            this.removeFromParent(true);
            if (this.bonus) {
                var updateRes = PlayerData.createResourceData(this.bonus.unit, this.bonus.value);
                PlayerData.updateResource(updateRes);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, updateRes);
                //cc.log(this.bonus.unit + ":" + this.bonus.value);
            }
        }.bind(this), this);
        var startPos = this.getPosition();

        var endPosition = this.getPackPosition();

        var curveValue = cc.p(300 + Math.random() * 40, 100 + Math.random() * 80);
        var movePath = [startPos,
            curveValue,
            endPosition];
        this.move = cc.bezierTo(0.75, movePath);
        this.moveUpAndBecomeBigger = cc.spawn(cc.moveBy(0.1, 0, 16), cc.scaleBy(0.1, 1.5));
        this.runAction(cc.sequence(this.appear, this.shine, this.moveUpAndBecomeBigger, this.move, this.count));
    }
});

/**
 * 根据掉落内容和位置快速添加掉落工具方法
 *
 * @param bonusSrc
 * @param pos
 * @returns {Array}
 */
Loot.generateLoots = function (bonusSrc, pos) {
    var lootSprites = [];
    var bonus = {unit: bonusSrc.unit, value: bonusSrc.value};
    if (bonusSrc.unit === "gold") {
        bonus.value = Math.floor(bonus.value * (1 + (PlayerData.globe_gold_rate + PlayerData.buff_gold_rate ) / 100));
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
            lootSprites.push(new Loot(bonus.unit, "amount"));
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 20, "little", bonus);
        } else {
            lootSprites.push(new Loot(bonus.unit, "some"));
            lootSprites.push(new Loot(bonus.unit, "amount"));
            lootSprites.push(new Loot(bonus.unit, "huge"));
            this.createLootSprites(lootSprites, 20, "little", bonus);
        }
    } else {
        this.createLootSprites(lootSprites, bonus.value, null, bonus);
    }
    if (pos) {
        for (var i in lootSprites) {
            lootSprites[i].setPosition(pos);
        }
    }
    return lootSprites;
};
Loot.createLootSprites = function (lootSprites, num, size, bonus) {
    for (var i = 0; i < num; i++) {
        if (i == num - 1) {
            lootSprites.push(new Loot(bonus.unit, size, bonus));
        } else {
            lootSprites.push(new Loot(bonus.unit, size));
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