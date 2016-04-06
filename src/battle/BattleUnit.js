/**
 * 英雄和敌人的父类，核心逻辑类
 *
 * @type {void|*|Function|Object}
 */
var BattleUnit = CCSUnit.extend({

    LIFE_BAR_ZORDER_OFFSET: 2,

    _initLifeBar: function () {
        //血条的NODE
        this.lifeBar = ccs.load(res.hero_blood_json).node.getChildByName('root');
        this.lifeBar.removeFromParent(true);
        this.lifeBar.setPosition(cc.p(-this._uiComponentTopLeft, this._uiComponentHeight + 2));
        this.addChild(this.lifeBar, this.LIFE_BAR_ZORDER_OFFSET);
    },

    /**
     * 显示头顶的血条
     */
    showLifeBar: function () {
        if (!this.lifeBar) {
            this._initLifeBar();
        }
        this.lifeBar.setVisible(true);
    },

    /**
     * 隐藏头顶的血条
     */
    hideLifeBar: function () {
        if (this.lifeBar) {
            this.lifeBar.setVisible(false);
        }
    },

    /**
     * 刷新血条
     */
    refreshLifeBar: function () {
        if (this.isDead()) {
            this.hideLifeBar();
        } else {
            this.showLifeBar();
            this.lifeBar.getChildByName('blood_bar').setPercent(this.getLife() / this.getMaxLife() * 100);
        }
    },

    /**
     * 获取最大生命值
     */
    getMaxLife: function () {
        cc.log("should be override");
    },

    /**
     * 修改生命值，正数为伤害，负数为治愈
     * @param val
     */
    changeLife: function (val) {
        cc.log("should be override");
    },

    /**
     * 重置单位的状态
     */
    reset: function () {
        this.moveCounter = 0;
        this.playAnimation('stand');
    },

    DAMAGE_NUMBER_ZORDER_OFFSET: 1,

    /**
     * 显示精灵受到的伤害或者治愈的数字
     *
     * @param val
     * @param ctr
     */
    showDamageNumber: function (val, ctr) {
        var dmg = DamageNumber.create(val, ctr);
        dmg.setPosition(cc.p(0, 64));
        this.battle.addSpriteRelatedNode(this, dmg, this.DAMAGE_NUMBER_ZORDER_OFFSET);
    },

    /**
     * 判断是否死亡
     */
    isDead: function () {
        cc.log("should be override");
    },

    /**
     * 获取当前生命值
     */
    getLife: function () {
        cc.log("should be override");
    },

    /**
     * 行动发生时的回调
     */
    onMove: function () {
        cc.log("should be override");
    },

    /**
     * 伤害发生时的回调
     * @param dmg
     */
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
    /**
     * 死亡发生时的回调
     */
    onDead: function () {
        cc.log("should be override");
    },
    //从精灵组里被删除时调用
    onClear: function () {
        this.removeFromParent(true);
    },

    /**
     * 受到伤害或者治愈的逻辑
     * @param dmg
     * @param ctr
     */
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

    /**
     * 累计时间间隔触发onMove
     * @param dt
     */
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

    /**
     * 添加一个buff图标
     * @param buffEffect
     */
    addBuff: function (buffEffect) {
        if (!this.buffIcons) {
            this.buffIcons = [];
        }
        this.buffIcons.push(buffEffect);
        buffEffect.setAnchorPoint(0, 0);
        this.battle.addSpriteRelatedNode(this, buffEffect, this.BUFF_ZORDER_OFFSET);
        this.refreshBuffIcons();
    },

    /**
     * 移除一个buff图标
     * @param buffEffect
     */
    removeBuff: function (buffEffect) {
        for (var i in this.buffIcons) {
            if (this.buffIcons[i] === buffEffect) {
                this.buffIcons.splice(i, 1);
            }
        }
        buffEffect.stopAllActions();
        buffEffect.removeFromParent(true);
        this.refreshBuffIcons();
    },

    _uiComponentTopLeft: 64,
    _uiComponentHeight: 86,

    refreshBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].setPosition(cc.p(this.getPositionX() + (i * 24) - this._uiComponentTopLeft, this.getPositionY() + this._uiComponentHeight + 6));
        }
    },

    /**
     * 显示Buff图标
     */
    showBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].resume();
            this.buffIcons[i].setVisible(true);
        }
    },

    /**
     * 隐藏Buff图标
     */
    hideBuffIcons: function () {
        for (var i in this.buffIcons) {
            this.buffIcons[i].pause();
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


