/**
 * Created by highkay on 2015/12/29.
 */
//伤害数字类
var DamageNumber = cc.Node.extend({
    ctor: function (val, ctr) {
        this._super();
        //this.textAtlas = new cc.LabelAtlas(val,
        //    res.num_font14,
        //    10,
        //    14, "0");
        this.textAtlas = ccs.load(res.battle_num_json).node.getChildByName("root").getChildByName("battle_num");
        // 修复TextAtlas控件的宽度适应
        this.textAtlas.ignoreContentAdaptWithSize(true);

        this.textAtlas.setAnchorPoint(0.5, 0.5);
        //移除从ccs读取的控件的parent
        this.textAtlas.removeFromParent(true);

        this.scaleLarge = cc.scaleTo(0.3, 2, 2);
        this.scaleBack = cc.scaleTo(0.1, 1, 1);

        this.moveUp = cc.moveBy(0.45, 0, 80);
        this.disappare = cc.callFunc(function () {
            this.removeFromParent(true);
            cc.pool.putInPool(this);
        }, this);
        this.initData(val, ctr);
        this.addChild(this.textAtlas);
    },

    initData: function (val, ctr) {
        this.size = ctr ? 40 : 20;
        this.textAtlas.setString(Math.round(val));
        //if (ctr) {
        //    this.textAtlas.color = cc.color(255, 100, 100);
        //} else {
        //    this.textAtlas.color = cc.color(255, 200, 200);
        //}
    },

    unuse: function () {
        this.setVisible(false);
    },

    reuse: function (val, ctr) {
        this.initData(val, ctr);
        this.setVisible(true);
    },

    fire: function () {
        this.runAction(cc.spawn(cc.sequence(this.scaleLarge, this.scaleBack), cc.sequence(this.moveUp, this.disappare)));
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