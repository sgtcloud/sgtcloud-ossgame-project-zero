//战斗单位逻辑类，英雄和敌人的父类
var BattleUnit = Unit.extend({

    getMaxLife: function () {
        cc.log("should be override");
    },

    //设置生命值
    changeLife: function (val) {
        cc.log("should be override");
    },
    //重置复位单位的生命值，动画 ，复活时使用
    reset: function () {
        this.moveCounter = 0;
        this.playAnimation('stand');
    },

    DAMAGE_NUMBER_ZORDER_OFFSET: 1,

    //调用显示伤害值
    showDamageNumber: function (val, ctr) {
        var dmg = DamageNumber.create(val, ctr);
        dmg.setPosition(cc.p(0, 64));
        this.battle.addSpriteRelatedNode(this, dmg, this.DAMAGE_NUMBER_ZORDER_OFFSET);
    },

    //判断是否死亡
    isDead: function () {
        cc.log("should be override");
    },
    getLife: function () {
        cc.log("should be override");
    },

    //执行攻击时被调用 为了扩展
    onMove: function () {
        cc.log("should be override");
    },
    //受到伤害时被调用 为了扩展
    onDamaged: function () {
        if (this.isDead()) {
            this.onDead();
        } else {
            this.playAnimation('hit', false, function () {
                this.playAnimation("stand", true);
            }.bind(this));
        }
    },
    //死亡时被调用 为了扩展
    onDead: function () {
        cc.log("should be override");
    },
    //从精灵组里被删除时调用
    onClear: function () {
        this.removeFromParent(true);
    },
    //执行伤害的函数
    doDamage: function (dmg, ctr) {
        // prevent to be kill twice
        if (!this.isDead()) {
            if (ctr) {
                dmg *= ctr;
            }
            this.changeLife(-dmg);
            this.onDamaged();
            this.showDamageNumber(dmg, ctr);
        }
    },

    getAnimateDelay: function () {
        cc.log("should be override");
    },

    update: function (dt) {
        var moveInterval = this.getAnimateDelay();
        //cc.log("interval:" + this.moveCounter + "/" + moveInterval);
        if (moveInterval > 0) {
            this.moveCounter += dt;
            while (this.moveCounter >= moveInterval) {
                this.moveCounter -= moveInterval;
                if (!this.isDead()) {
                    this.onMove();
                }
            }
        }
    },

    ctor: function (battle) {
        this._super();
        this.battle = battle;
        this.moveCounter = 0;
        this.scheduleUpdate();
    }
});


