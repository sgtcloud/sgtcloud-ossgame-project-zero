/**
 * Created by highkay on 2015/12/29.
 */

//英雄扩展类
var HeroUnit = BattleUnit.extend({
    ctor: function (battle, data) {
        this._super(battle, data, BattleConsts.Camp.Player);
        this.recover = 0;
        this.cooldown = 0;

        //血条的NODE

        this.lifeNode = Unit.create(res.hero_blood_json);
        this.lifeNode.setAnchorPoint(0.5, 0.5);
        this.lifeNode.setPositionY(86);
        this.addChild(this.lifeNode);

        //血条组件的引用
        this.lifeBar = this.lifeNode.getChildByName('root').getChildByName('blood_bar');
        //刷新刷条
        this.refreshLifeBar = function () {
            if (this.isDead()) {
                this.lifeNode.setVisible(false);
            } else {
                this.lifeNode.setVisible(true);
            }
            var max = this.data.getLife();
            this.lifeBar.setPercent(this.data.getCurrentLife() / max * 100);
        };
        this.getLife = function () {
            return this.data.getCurrentLife();
        };
        this.isDead = function () {
            return this.data.getCurrentLife() <= 0;
        };
        this.onMove = function () {
            var target = battle.findNextEnemy();
            if (target) {
                this.playAnimation('atk');
                var rand = Math.random();
                var ctr_chance = this.data.getCtrChance();
                //cc.log("ctr:" + rand + "/" + ctr_chance);
                if (rand < ctr_chance) {
                    customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
                    target.doDamage(this.data.getAttack(), this.data.getCtrModify());
                } else {
                    target.doDamage(this.data.getAttack());
                }
            }
        };
        this.changeLife = function (val) {
            this.data.changeLife(val);
        };
        this.onDamaged = function () {
            this.refreshLifeBar();
        };
        this.onDead = function () {
            this.recover = this.data.getRecover();
            customEventHelper.sendEvent(EVENT.HERO_DIE, this.data);

            this.playAnimation("die", false, function () {
                var srcPos = this.getPosition();
                var dropHeight = 500;
                var dropMove = cc.jumpTo(0.2, srcPos, 0, 1);
                var jump = cc.jumpBy(0.5, cc.p(0, 0), 16, 3);
                this.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                    this.setPosition(srcPos.x, srcPos.y + dropHeight);
                    this.playAnimation('dead');
                }, this), cc.fadeIn(0.2), dropMove, jump));
            });

            //battle.onHeroDead(this);
            //var lost = battle.checkPlayerLost();
            //if(lost){
            //  battle.resetBattle();
            //}
        };
        //复活时被调用的
        this.onRecover = function () {
            this.changeLife(this.getMaxLife());
            this.reset();
            this.refreshLifeBar();
            battle.onHeroRecover(this);
            customEventHelper.sendEvent(EVENT.HERO_REVIVE, this.data);
        };
        this.reset = function () {
            this.moveCounter = 0;
            this.node.runAction(cc.fadeIn(1.0));
            this.playAnimation('stand');
        }
        //使用主动技能时被调用
        this.onUseSkill = function () {

        };
        //复活的当前时间
        this.getRecover = function () {
            return this.recover;
        };
        //技能的当前CD
        this.getCooldown = function () {
            return this.cooldown;
        };
        //复活倒计时逻辑
        this.onUpdateDead = function (dt) {
            this.recover = Math.max(0, this.recover - dt);
            if (this.recover <= 0) {
                this.onRecover();
            } else {
                customEventHelper.sendEvent(EVENT.HERO_REVIVE_COUNTDOWN, {
                    id: this.data.getId(),
                    recover: this.recover
                });
            }
        };
        this.isActive = function () {
            return !this.data.isLocked();
        };
        this.refreshLifeBar();

        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            // 暂时不需要改
        });
        customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE, function (event) {
            this.data.refreshProps();
            PlayerData.refreshGlobeProps();
        }.bind(this));
        customEventHelper.bindListener(EVENT.HERO_EQUIP_UPGRADE, function (event) {
            this.data.refreshProps();
            PlayerData.refreshGlobeProps();
        }.bind(this));
        customEventHelper.bindListener(EVENT.HERO_BUY_REVIVE, function (event) {
            var hero = event.getUserData();
            if (hero.getId() === self.data.getId() && self.isDead()) {
                this.recover = 0;
                this.onRecover();
            }
        }.bind(this));
    }
});