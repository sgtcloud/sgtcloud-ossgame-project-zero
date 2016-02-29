//战斗单位逻辑类，英雄和敌人的父类
var BattleUnit = CCSUnit.extend({

    LIFE_BAR_ZORDER_OFFSET: 2,

    _initLifeBar: function () {
        //血条的NODE
        this.lifeBar = ccs.load(res.hero_blood_json).node.getChildByName('root');
        this.lifeBar.removeFromParent(true);
        this.lifeBar.setPosition(cc.p(-this._uiComponentTopLeft, this._uiComponentHeight + 2));
        this.addChild(this.lifeBar, this.LIFE_BAR_ZORDER_OFFSET);
    },

    showLifeBar: function () {
        if (!this.lifeBar) {
            this._initLifeBar();
        }
        this.lifeBar.setVisible(true);
    },

    hideLifeBar: function () {
        if (this.lifeBar) {
            this.lifeBar.setVisible(false);
        }
    },

    refreshLifeBar: function () {
        if (this.isDead()) {
            this.hideLifeBar();
        } else {
            this.showLifeBar();
            this.lifeBar.getChildByName('blood_bar').setPercent(this.getLife() / this.getMaxLife() * 100);
        }
    },

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
    onDamaged: function (dmg) {
        if (this.isDead()) {
            this.onDead();
        } else {
            if (dmg >= 0) {
                this.playAnimation('hit', false, function () {
                    this.playAnimation("stand", true);
                }.bind(this));
            }
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
            this.onDamaged(dmg);
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

    BUFF_ZORDER_OFFSET: 3,

    addBuff: function (buffEffect) {
        if (!this.buffIcons) {
            this.buffIcons = [];
        }
        this.buffIcons.push(buffEffect);
        buffEffect.setAnchorPoint(0, 0);
        this.addChild(buffEffect, this.BUFF_ZORDER_OFFSET);
        this.refreshBuffIcons();
    },

    removeBuff: function (buffEffect) {
        for (var i in this.buffIcons) {
            if (this.buffIcons[i] === buffEffect) {
                this.buffIcons.splice(i, 1);
            }
        }
        buffEffect.removeFromParent(true);
        this.refreshBuffIcons();
    },

    _uiComponentTopLeft: 64,
    _uiComponentHeight: 86,

    refreshBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].setPosition(cc.p((i * 24) - this._uiComponentTopLeft, this._uiComponentHeight + 6));
        }
    },

    showBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].setVisible(true);
        }
    },

    hideBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].setVisible(false);
        }
    },

    ctor: function (battle) {
        this._super();
        this.battle = battle;
        this.moveCounter = 0;
        this.scheduleUpdate();
    }
});


