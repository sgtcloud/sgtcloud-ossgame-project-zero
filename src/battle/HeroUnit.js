/**
 * 英雄单位vm类
 *
 * Created by highkay on 2015/12/29.
 */
var HeroUnit = BattleUnit.extend({

    getAnimateDelay: function () {
        return this.hero.getAnimateDelay();
    },

    update: function (dt) {
        this._super(dt);
        this.onReviveCountTime(dt);

    },
    onReviveCountTime: function (dt) {
        //复活倒计时逻辑
        if (this.isDead()) {
            this.recover = Math.max(0, this.recover - dt);
            if (this.recover <= 0) {
                this.onRevive();
            } else {
                customEventHelper.sendEvent(EVENT.HERO_REVIVE_COUNTDOWN, {
                    id: this.hero.getId(),
                    recover: Math.round(this.recover)
                });
            }
        }
    },

    getLife: function () {
        return this.hero.getCurrentLife();
    },
    isDead: function () {
        return this.hero.getCurrentLife() <= 0;
    },

    onMove: function () {
        var target = this.battle.findNextEnemy();
        if (target) {
            this.moveHandle(target);
        }
    },
    moveHandle: function (target) {
        this.isMove = true;
        this.playAnimation('atk', false, function () {
            this.playAnimation("stand", true);
            this.isMove = false;
        }.bind(this));
        var rand = Math.random();
        var ctr_chance = this.hero.getCtrChance();
        //cc.log("ctr:" + rand + "/" + ctr_chance);
        if (rand < ctr_chance) {
            customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
            target.doDamage(this.hero.getAttack(), this.hero.getCtrModify());
        } else {
            target.doDamage(this.hero.getAttack());
        }
    },
    changeLife: function (val) {
        this.hero.changeLife(val);
    },
    onDamaged: function (dmg) {
        this._super(dmg);
        this.refreshLifeBar();
    },

    TOMBSTONE_ZORDER_OFFSET: 2,

    onDead: function (recover) {
        this.recover = recover || this.hero.getRecover();
        customEventHelper.sendEvent(EVENT.HERO_DIE, this.hero);
        this.deadHandle();
        //battle.onHeroDead(this);
        //var lost = battle.checkPlayerLost();
        //if(lost){
        //  battle.resetBattle();
        //}
    },
    deadHandle: function () {
        this.hideBuffIcons();
        this.refreshLifeBar();
        this.stopAllActions();
        var dropHeight = 500;
        var dropMove = cc.jumpBy(0.5, cc.p(0, -dropHeight), 0, 1);
        var jump = cc.jumpBy(0.5, cc.p(0, 0), 16, 3);
        this.tombstone.setVisible(true);
        this.tombstone.setPosition(0, dropHeight);
        this.tombstone.runAction(cc.sequence(dropMove, jump));
        this.battle.addSpriteRelatedNode(this, this.tombstone, this.TOMBSTONE_ZORDER_OFFSET);
        this.playAnimation("die", false, function () {
            this.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                this.setVisible(false);
            }.bind(this), this)));
        }.bind(this));
    },

//复活时被调用的
    onRevive: function () {
        this.setVisible(true);
        this.showBuffIcons();
        this.tombstone.setVisible(false);
        this.tombstone.removeFromParent(true);
        this.changeLife(this.getMaxLife());
        this.reset();
        customEventHelper.sendEvent(EVENT.HERO_REVIVE, this.hero);
    },
    reset: function () {
        this._super();
        this.runAction(cc.fadeIn(1.0));
        this.refreshLifeBar();
    },
//复活的当前时间
    getRecover: function () {
        return this.recover;
    },

    getMaxLife: function () {
        return this.hero.getLife();
    },

    isActive: function () {
        return !this.hero.isLocked();
    },
    onClear: function () {
        //this._super();
        //this.removeFromParent(true);
        this.setVisible(false);
        this.tombstone.removeFromParent(true);
        this.hideBuffIcons();
    },
    ctor: function (battle, hero) {
        this._super(battle);

        this.initHero(hero);
        this.bindListeners();
        this.initTombstone();
    },
    initHero: function (hero) {
        this.hero = hero;
        this.initSprite(res[this.hero.getFile()], 'hero', "stand");
        this.refreshLifeBar();
    },
    initTombstone: function () {
        this.tombstone = CCSUnit.create(res.tombstone_json);
        this.tombstone.setVisible(false);
    },
    bindListeners: function () {
        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            // 暂时不需要改
        }.bind(this));
        customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE, function (event) {
            this.hero.refreshProps();
            PlayerData.refreshGlobeProps();
        }.bind(this));
        customEventHelper.bindListener(EVENT.HERO_EQUIP_UPGRADE, function (event) {
            this.hero.refreshProps();
            PlayerData.refreshGlobeProps();
        }.bind(this));
        customEventHelper.bindListener(EVENT.HERO_BUY_REVIVE, function (event) {
            var hero = event.getUserData();
            if (hero.getId() === this.hero.getId() && this.isDead()) {
                this.recover = 0;
                this.onRevive();
            }
        }.bind(this));
    },
    onEnter: function () {
        this._super();
        this.onEnterHandle();
    },
    onEnterHandle: function () {
        if (this.hero.getCurrentLife() <= 0) {
            var dieTime = PlayerData.getHeroDeadTime(this.hero.getId());
            var currentTime = PlayerData.getServerTime();
            var recoverTime = this.hero.getRecover() - (currentTime - dieTime ) / 1000;
            console.log(this.hero.getId() + ' dieTime : ' + dieTime + ',recoverTime:' + recoverTime);
            if (recoverTime > 0) {
                // convert millisecond to second
                this.onDead(recoverTime);
            } else {
                PlayerData.clearHeroDeadTime(this.hero.getId());
                this.onRevive();
            }
        }
    },
    revert: function () {
        this.setVisible(true);
        this.showBuffIcons();
        this.refreshBuffIcons();
    }
});