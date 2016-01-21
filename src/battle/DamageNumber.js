/**
 * Created by highkay on 2015/12/29.
 */
//伤害数字类
var DamageNumber = cc.Class.extend({
    ctor: function (val, ctr) {
        var texts = ccs.load(res.battle_num_json).node.getChildByName("root");
        this.damageText = texts.getChildByName("battle_num");
        this.recoverText = texts.getChildByName("recover_num");
        // 修复TextAtlas控件的宽度适应
        this.damageText.ignoreContentAdaptWithSize(true);

        this.damageText.setAnchorPoint(0.5, 0.5);
        //移除从ccs读取的控件的parent
        this.damageText.removeFromParent(true);
        // 修复TextAtlas控件的宽度适应
        this.recoverText.ignoreContentAdaptWithSize(true);

        this.recoverText.setAnchorPoint(0.5, 0.5);
        //移除从ccs读取的控件的parent
        this.recoverText.removeFromParent(true);

        this.moveUp = cc.moveBy(0.45, 0, 80);
        this.disappare = cc.callFunc(function () {
            this.textAtlas.removeFromParent(true);
            cc.pool.putInPool(this);
        }, this);
        this.initData(val, ctr);
    },

    initData: function (val, ctr) {
        var size = ctr ? 8 : 2;
        this.scaleLarge = cc.scaleTo(0.25, size, size);
        this.scaleBack = cc.scaleTo(0.075, 1, 1);
        if (val < 0) {
            this.textAtlas = this.recoverText;
        } else {
            this.textAtlas = this.damageText;
        }
        this.textAtlas.setString(Math.floor(val));
    },

    unuse: function () {
    },

    reuse: function (val, ctr) {
        this.initData(val, ctr);
    },

    setPosition: function (pos) {
        this.textAtlas.setPosition(pos);
    },

    fire: function (node) {
        node.addChild(this.textAtlas);
        this.textAtlas.setVisible(true);
        this.textAtlas.runAction(cc.spawn(cc.sequence(this.scaleLarge, this.scaleBack), cc.sequence(this.moveUp, this.disappare)));
    }
});

// 重用对象
DamageNumber.create = function (val, ctr) {
    var pool = cc.pool;
    if (pool.hasObject(DamageNumber)) {
        return pool.getFromPool(DamageNumber, val, ctr);
    } else {
        return new DamageNumber(val, ctr);
    }
};

// 初始化对象32个放入池中
DamageNumber.initPool = function () {
    for (var i = 0; i < 32; i++) {
        cc.pool.putInPool(new DamageNumber());
    }
};