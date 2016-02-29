/**
 * Created by highkay on 2015/12/29.
 */

//英雄扩展类
var HeroUnit = BattleUnit.extend({

    getAnimateDelay: function () {
        return this.hero.getAnimateDelay();
    },

    update: function (dt) {
        this._super(dt);

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
            this.playAnimation('atk', false, function () {
                this.playAnimation("stand", true);
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

        //battle.onHeroDead(this);
        //var lost = battle.checkPlayerLost();
        //if(lost){
        //  battle.resetBattle();
        //}
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

    ctor: function (battle, hero) {
        this._super(battle);
        this.hero = hero;
        this.initSprite(res[this.hero.getFile()], 'hero', "stand");

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

        this.tombstone = CCSUnit.create(res.tombstone_json);
        this.tombstone.setVisible(false);
        this.refreshLifeBar();
    },

    onEnter: function () {
        this._super();

        if (this.hero.getCurrentLife() <= 0) {
            var dieTime = PlayerData.getHeroDeadTime(this.hero.getId());
            // todo make the current time to be a certain server time
            var currentTime = PlayerData.getServerTime();
            var recoverTime = currentTime - dieTime - this.hero.getRecover() * 1000;
            if (recoverTime > 0) {
                // convert millisecond to second
                this.onDead(recoverTime / 1000);
            }
        }
    }
});