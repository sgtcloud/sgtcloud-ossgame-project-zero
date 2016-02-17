/**
 * Created by highkay on 2015/12/29.
 */

//英雄扩展类
var HeroUnit = BattleUnit.extend({

    lifeBar: null,

    initLifeBar: function () {
        //血条的NODE
        this.lifeBar = ccs.load(res.hero_blood_json).node.getChildByName('root').getChildByName('blood_bar');
        this.lifeBar.setAnchorPoint(0.5, 0.5);
        this.lifeBar.removeFromParent(true);
        this.lifeBar.setPositionY(86);
        this.addChild(this.lifeBar);
    },

    refreshLifeBar: function () {
        if (this.isDead()) {
            this.lifeBar.setVisible(false);
        } else {
            this.lifeBar.setVisible(true);
        }
        var max = this.hero.getLife();
        this.lifeBar.setPercent(this.hero.getCurrentLife() / max * 100);
    },

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
    //刷新刷条
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
    onDamaged: function () {
        this._super();
        this.refreshLifeBar();
    },

    TOMBSTONE_ZORDER_OFFSET: 2,

    onDead: function () {
        this.recover = this.hero.getRecover();
        customEventHelper.sendEvent(EVENT.HERO_DIE, this.hero);
        this.refreshLifeBar();
        this.stopAllActions();
        this.playAnimation("die", false, function () {
            this.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                this.setVisible(false);
                var dropHeight = 500;
                var dropMove = cc.jumpBy(0.2, cc.p(0, -dropHeight), 0, 1);
                var jump = cc.jumpBy(0.5, cc.p(0, 0), 16, 3);
                this.tombstone.setVisible(true);
                this.tombstone.setPosition(0, dropHeight);
                this.tombstone.runAction(cc.sequence(dropMove, jump));
                this.battle.addSpriteRelatedNode(this, this.tombstone, this.TOMBSTONE_ZORDER_OFFSET);
            }, this)));
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
        this.tombstone.setVisible(false);
        this.tombstone.removeFromParent(true);
        this.reset();
        this.battle.onHeroRecover(this);
        customEventHelper.sendEvent(EVENT.HERO_REVIVE, this.hero);
    },
    reset: function () {
        this._super();
        this.changeLife(this.getMaxLife());
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

//技能的当前CD
    getCooldown: function () {
        return this.cooldown;
    },
    isActive: function () {
        return !this.hero.isLocked();
    },

    ctor: function (battle, hero) {
        this._super(battle);
        this.recover = 0;
        this.cooldown = 0;
        this.hero = hero;
        this.initSprite(res[this.hero.getFile()], 'hero');

        this.initLifeBar();
        this.refreshLifeBar();

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

        this.reset();
        // 重新把存档的血量赋值
        this.life = this.hero.getCurrentLife();

        this.tombstone = ccs.load(res.tombstone_json).node;
        this.tombstone.removeFromParent(true);
        this.tombstone.setVisible(false);
    },
});